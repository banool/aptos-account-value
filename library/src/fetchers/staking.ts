import { Aptos, AccountAddress, InputViewRequestData, HexInput } from "@aptos-labs/ts-sdk";
import { GetDelegatedStakingQuery, GetDelegatedStakingRoyaltiesQuery } from "../codegen/indexer/generated/operations";
import { GetDelegatedStaking, GetDelegatedStakingRoyalties } from "../codegen/indexer/generated/queries";
import { ensureMillisecondTimestamp, sequentialMap, sum } from "../core/helpers";
import { APT_DECIMALS, ASSET_APTOS_COIN, Asset } from "../core/types";

/**
 * Get the total amount of APT owned by the account in delegated staking pools.
 *
 * This looks for all delegated staking pools and includes not just the locked sum,
 * but amounts pending withdrawal, rewards, etc.
 */
export async function fetchStake({
  client,
  accountAddress,
}: {
  client: Aptos;
  accountAddress: HexInput;
}): Promise<Asset[]> {
  const address = AccountAddress.from(accountAddress);
  const allStake = await getAllStake(client, address);
  return [
    {
      address: ASSET_APTOS_COIN.address,
      amount: allStake.total,
      decimals: APT_DECIMALS,
      prettyName: ASSET_APTOS_COIN.prettyName,
    },
  ];
}

async function getAllStake(client: Aptos, delegatorAddress: AccountAddress) {
  const result = await getPoolsAddressHasDelegatedStakeTo(client, delegatorAddress);
  const pools = result?.delegator_distinct_pool ?? [];
  const allStakes: Stake[] = await sequentialMap(pools, async (pool): Promise<Stake> => {
    if (!pool.pool_address) {
      throw Error("pool_address is undefined");
    }
    const validatorAddress = AccountAddress.fromStringRelaxed(pool.pool_address);

    const [stake, stakePool, principals] = await Promise.all([
      getStake(client, delegatorAddress, validatorAddress),
      getStakePool(client, validatorAddress),
      getStakePrincipals({
        client,
        delegatorAddress,
        validatorOwnerAddress: validatorAddress,
      }),
    ]);

    const totalRewards: Stake["totalRewards"] = {
      active: principals.active && stake.active > principals.active ? stake.active - principals.active : 0,
      pendingWithdraw:
        principals.pendingWithdraw && stake.withdrawPending > principals.pendingWithdraw
          ? stake.withdrawPending - principals.pendingWithdraw
          : 0,
    };

    return {
      active: stake.active,
      lockedUntil: stakePool?.locked_until_secs,
      operatorAddress: pool.staking_pool_metadata?.operator_address ?? "",
      operatorAptosName: pool.staking_pool_metadata?.operator_aptos_name[0]?.domain ?? undefined,
      poolAddress: pool.pool_address ?? "",
      principals,
      totalRewards,
      withdrawPending: stake.withdrawPending,
      withdrawReady: stake.withdrawReady,
    };
  });

  return {
    stakes: allStakes,
    total: sum(allStakes, (stake) => stake.active + stake.withdrawPending + stake.withdrawReady),
    totals: {
      active: sum(allStakes, (stake) => stake.active),
      withdrawPending: sum(allStakes, (stake) => stake.withdrawPending),
      withdrawReady: sum(allStakes, (stake) => stake.withdrawReady),
    },
  };
}

type UseStakePrincipalsReturnValue = {
  active: number;
  pendingWithdraw: number;
};

export async function getStakePrincipals({
  client,
  delegatorAddress,
  validatorOwnerAddress,
}: {
  client: Aptos;
  delegatorAddress: AccountAddress;
  validatorOwnerAddress: AccountAddress;
}): Promise<UseStakePrincipalsReturnValue> {
  try {
    const result = await client.queryIndexer<GetDelegatedStakingRoyaltiesQuery>({
      query: {
        query: GetDelegatedStakingRoyalties,
        variables: {
          address: delegatorAddress.toStringLong(),
          pool: validatorOwnerAddress.toStringLong(),
        },
      },
    });

    const activities = result?.delegated_staking_activities ?? [];

    return activities
      .slice()
      .sort((a, b) => Number(a.transaction_version) - Number(b.transaction_version))
      .reduce(
        (memo, activity) => {
          let { active, pendingWithdraw } = memo;

          const eventType = activity.event_type.split("::")[2];

          const { amount } = activity;

          switch (eventType) {
            case "AddStakeEvent":
              active += amount;
              break;
            case "UnlockStakeEvent":
              active -= amount;
              pendingWithdraw += amount;
              break;
            case "ReactivateStakeEvent":
              active += amount;
              pendingWithdraw -= amount;
              break;
            case "WithdrawStakeEvent":
              pendingWithdraw -= amount;
              break;
            default:
              // eslint-disable-next-line no-console
              console.log("not found", eventType);
              break;
          }

          return {
            active: Math.max(0, active),
            pendingWithdraw: Math.max(0, pendingWithdraw),
          };
        },
        { active: 0, pendingWithdraw: 0 },
      );
  } catch (e) {
    return {
      active: 0,
      pendingWithdraw: 0,
    };
  }
}

export type StakeStates = "active" | "withdrawPending" | "withdrawReady";
type StakeTotals = Record<StakeStates, number>;

export interface Stake extends StakeTotals {
  lockedUntil?: string;
  operatorAddress: string;
  operatorAptosName?: string | null;
  poolAddress: string;
  principals: { active: number; pendingWithdraw: number };
  totalRewards: { active: number; pendingWithdraw: number };
}

export interface UseStakingReturnType {
  stakes: Stake[];
  total: number;
  totals: StakeTotals;
}

/**
 * Return whether `pending_inactive` stake can be directly withdrawn from the delegation pool,
 * for the edge case when the validator had gone inactive before its lockup expired.
 */
async function getCanWithdrawPendingInactive(client: Aptos, validatorAddress: AccountAddress): Promise<boolean> {
  const payload: InputViewRequestData = {
    function: "0x1::delegation_pool::can_withdraw_pending_inactive",
    functionArguments: [validatorAddress.toStringLong()],
  };
  const res = await client.view({ payload });
  return Boolean(res[0]);
}

/**
 * Get the stakes for a delegator in a delegation
 * pool, via the node client.
 */
async function getStake(
  client: Aptos,
  delegatorAddress: AccountAddress,
  validatorAddress: AccountAddress,
): Promise<StakeTotals> {
  const payload: InputViewRequestData = {
    function: "0x1::delegation_pool::get_stake",
    functionArguments: [validatorAddress.toStringLong(), delegatorAddress.toStringLong()],
  };

  const result = await client.view({ payload });
  const stakes: StakeTotals = {
    active: Number(result[0]),
    withdrawPending: Number(result[2]),
    withdrawReady: Number(result[1]),
  };

  const canWithdrawPendingInactive = await getCanWithdrawPendingInactive(client, validatorAddress);
  if (stakes.withdrawPending && canWithdrawPendingInactive) {
    stakes.withdrawReady += stakes.withdrawPending;
    stakes.withdrawPending = 0;
  }

  return stakes;
}

async function getPoolsAddressHasDelegatedStakeTo(
  client: Aptos,
  delegatorAddress: AccountAddress,
): Promise<GetDelegatedStakingQuery> {
  const out = await client.queryIndexer<GetDelegatedStakingQuery>({
    query: { query: GetDelegatedStaking, variables: { address: delegatorAddress.toStringLong() } },
  });
  return out;
}

async function getStakePool(client: Aptos, accountAddress: AccountAddress) {
  const data = await client.account.getAccountResource({ accountAddress, resourceType: "0x1::stake::StakePool" });
  if (!data) return null;
  data.locked_until_secs = ensureMillisecondTimestamp(data.locked_until_secs);
  return data;
}
