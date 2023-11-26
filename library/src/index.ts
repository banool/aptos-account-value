import { AccountAddress, AccountAddressInput, Aptos } from "@aptos-labs/ts-sdk";
import { Asset, OutputCurrency } from "./core";
import { fetchCoins, fetchStake } from "./fetchers";
import { AppraiseResult, appraise, getPrices } from "./appraisers";

export { AppraiseResult } from "./appraisers";
export { Asset, OutputCurrency } from "./core";

export async function getAccountValueMany({
  client,
  accountAddresses,
  outputCurrency = OutputCurrency.USD,
}: {
  client: Aptos;
  accountAddresses: AccountAddressInput[];
  outputCurrency?: OutputCurrency;
}): Promise<Map<AccountAddress, AppraiseResult>> {
  // Confirm the given addresses are valid.
  accountAddresses.forEach((address) => AccountAddress.from(address));

  // Fetch assets on the accounts.
  const addressToAssets = await Promise.all(
    accountAddresses.map(async (accountAddress) => {
      const assets: Asset[] = [];
      assets.push(...(await fetchCoins({ client, accountAddress })));
      assets.push(...(await fetchStake({ client, accountAddress })));
      return [accountAddress, assets] as const;
    }),
  );

  // Get all the addresses of the assets across all accounts, deduplicating.
  const addresses = new Set<string>();
  for (const [_, assets] of addressToAssets.values()) {
    for (const asset of assets) {
      addresses.add(asset.typeString);
    }
  }

  // Lookup the prices of the assets.
  const prices = await getPrices({ addresses: Array.from(addresses), outputCurrency });

  // Get the value of the assets for each account.
  const out = new Map<AccountAddress, AppraiseResult>();
  for (const [accountAddress, assets] of addressToAssets) {
    const result = appraise({ assets, prices });
    out.set(AccountAddress.from(accountAddress), result);
  }

  return out;
}
