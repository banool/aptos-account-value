/* eslint guard-for-in: 0 */

import { Aptos, AccountAddressInput } from "@aptos-labs/ts-sdk";
import { Asset } from "../core/types";
import { deduplicateAssets } from "../core/helpers";

/**
 * Get all the assets currently in liquidity pools in Cellana. At this point in time
 * this does not include any rewards in CELL. It is necessary to have a separate fetcher
 * because when you add liquidity on Cellana, it doesn't give you an equivalent LP token
 * or anything, the data is stored elsewhere on chain. So this fetcher uses their API
 * instead.
 */
interface Pool {
  /** e.g. CELL/APT */
  name: string;
  address: string;
  gaugeAddress: string;
  token0: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  };
  token1: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  };
}

export async function fetchCellanaDeposits({
  client,
  accountAddress,
}: {
  client: Aptos;
  accountAddress: AccountAddressInput;
}): Promise<Asset[]> {
  const assets: Asset[] = [];

  // Step 1: Query all pools
  const poolsResponse = await fetch("https://api-v2.cellana.finance/api/v1/pool/0x0");
  if (!poolsResponse.ok) {
    throw new Error(`Failed to fetch Cellana pools: ${poolsResponse.status} ${poolsResponse.statusText}`);
  }
  const poolsData = await poolsResponse.json();
  const pools: Pool[] = poolsData.data.map((item: any) => item.pool);

  for (const pool of pools) {
    // Step 2: Get stake balance for each pool
    const stakeBalance = await client.view({
      payload: {
        function: "0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1::gauge::stake_balance",
        functionArguments: [accountAddress, pool.gaugeAddress],
      },
    });

    const liquidity = BigInt(stakeBalance[0] as string);

    if (liquidity > 0n) {
      // Step 3: Get liquidity amounts for pools with non-zero balance
      const liquidityAmounts = await client.view({
        payload: {
          function:
            "0x4bf51972879e3b95c4781a5cdcb9e1ee24ef483e7d22f2d903626f126df62bd1::liquidity_pool::liquidity_amounts",
          functionArguments: [pool.address, liquidity.toString()],
        },
      });

      assets.push({
        typeString: pool.token0.address,
        amount: parseInt(liquidityAmounts[0] as string, 10),
        decimals: pool.token0.decimals,
        prettyName: `${pool.token0.name} (Cellana)`,
      });

      assets.push({
        typeString: pool.token1.address,
        amount: parseInt(liquidityAmounts[1] as string, 10),
        decimals: pool.token1.decimals,
        prettyName: `${pool.token1.name} (Cellana)`,
      });
    }
  }

  return deduplicateAssets(assets);
}
