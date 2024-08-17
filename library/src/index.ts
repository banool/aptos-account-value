import { AccountAddress, AccountAddressInput, Aptos } from "@aptos-labs/ts-sdk";
import { Asset, OutputCurrency, attachDecimalInformation } from "./core";
import { fetchAriesDeposits, fetchCoins, fetchStake } from "./fetchers";
import { AppraiseResult, appraise, getPrices } from "./appraisers";
import { fetchCellanaDeposits } from "./fetchers/cellana";

export { AppraiseResult } from "./appraisers";
export { Asset, OutputCurrency } from "./core";

/**
 * @returns A map of account addresses to AppraiseResult. The account addresses are
 * strings in AIP-40 format (accountAddress.toString()). We don't use the
 * AccountAddress type itself because two identical AccountAddresses don't compare as
 * equal due to the magic of compare by reference for non primitives in JS.
 */
export async function getAccountValueMany({
  client,
  accountAddresses,
  outputCurrency = OutputCurrency.USD,
  minimumBalance = 0.1,
}: {
  client: Aptos;
  accountAddresses: AccountAddressInput[];
  outputCurrency?: OutputCurrency;
  minimumBalance?: number;
}): Promise<Map<string, AppraiseResult>> {
  // Confirm the given addresses are valid.
  accountAddresses.forEach((address) => AccountAddress.from(address));

  // Fetch assets on the accounts.
  const addressToAssets = await Promise.all(
    accountAddresses.map(async (accountAddress) => {
      const assets: Asset[] = [];
      assets.push(...(await fetchCoins({ client, accountAddress })));
      assets.push(...(await fetchStake({ client, accountAddress })));
      assets.push(...(await fetchAriesDeposits({ accountAddress })));
      assets.push(...(await fetchCellanaDeposits({ client, accountAddress })));
      return [accountAddress, assets] as const;
    }),
  );

  // Filter out assets with less than the minimum balance.
  const addressToAssetsFiltered = new Map<AccountAddressInput, Asset[]>();
  for (const [address, assets] of addressToAssets) {
    const filteredAssets = assets.filter((asset) => asset.amount > minimumBalance);
    addressToAssetsFiltered.set(address, filteredAssets);
  }

  // Get all the addresses of the assets across all accounts, deduplicating.
  const assetTypeStrings = new Set<string>();
  for (const [_, assets] of addressToAssets.values()) {
    for (const asset of assets) {
      assetTypeStrings.add(asset.typeString);
    }
  }

  // Attach decimals to the assets if not already there. This operates in place.
  await attachDecimalInformation({ client, assets: Array.from(addressToAssetsFiltered.values()).flat() });

  // Lookup the prices of the assets.
  const prices = await getPrices({ addresses: Array.from(assetTypeStrings), outputCurrency });

  // Get the value of the assets for each account.
  const out = new Map<string, AppraiseResult>();
  for (const [accountAddress, assets] of addressToAssets) {
    const result = appraise({ assets, prices });
    out.set(AccountAddress.from(accountAddress).toString(), result);
  }

  return out;
}
