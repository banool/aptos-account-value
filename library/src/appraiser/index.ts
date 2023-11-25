import { Asset, OutputCurrency } from "../core/types";
import { getPrices } from "./api";

export type AppraiseResult = {
  /** The total value of the assets in the account, excluding those listed in unknownAssetAddresses. */
  totalValue: number;
  /** The assets contributing to the total value. */
  knownAssets: Asset[];
  /** The assets that we didn't know how to look up the price for. */
  unknownAssets: Asset[];
};

/**
 *
 * This function takes in a list of Assets and returns their value in the requested
 * currency.
 */
export async function appraise({
  assets,
  outputCurrency = OutputCurrency.USD,
}: {
  assets: Asset[];
  outputCurrency?: OutputCurrency;
}): Promise<AppraiseResult> {
  // Get all the addresses of the assets, deduplicating.
  const addresses = [...new Set(assets.map((asset) => asset.address))];

  // Lookup the prices of the assets.
  const prices = await getPrices({ addresses, outputCurrency });

  const knownAssets: Asset[] = [];
  const unknownAssets: Asset[] = [];

  // Sum up the value of the assets.
  let totalValue = 0;
  for (const asset of assets) {
    const price = prices[asset.address];
    if (price === undefined) {
      unknownAssets.push(asset);
    } else {
      knownAssets.push(asset);
      totalValue += (asset.amount * price) / 10 ** (asset.decimals ?? 0);
    }
  }

  return {
    totalValue,
    knownAssets,
    unknownAssets,
  };
}
