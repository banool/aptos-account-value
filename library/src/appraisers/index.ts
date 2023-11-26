import { Asset } from "../core/types";

export { getPrices } from "./gecko/api";

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
export function appraise({ assets, prices }: { assets: Asset[]; prices: Map<string, number> }): AppraiseResult {
  const knownAssets: Asset[] = [];
  const unknownAssets: Asset[] = [];

  // Sum up the value of the assets.
  let totalValue = 0;
  for (const asset of assets) {
    const price = prices.get(asset.typeString);
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
