import { AppraisedAsset, Asset } from "../core/types";

export { getPrices } from "./gecko/api";

export type AppraiseResult = {
  /** The total value of the assets in the account, excluding those listed in unknownAssetAddresses. */
  totalValue: number;
  /** The assets contributing to the total value. */
  knownAssets: AppraisedAsset[];
  /** The assets that we didn't know how to look up the price for. */
  unknownAssets: Asset[];
};

/**
 *
 * This function takes in a list of Assets and returns their value in the requested
 * currency. At this point we assume `decimals` is set for all Assets.
 */
export function appraise({ assets, prices }: { assets: Asset[]; prices: Map<string, number> }): AppraiseResult {
  const knownAssets: AppraisedAsset[] = [];
  const unknownAssets: Asset[] = [];

  // Separate the assets into known and unknown assets. For known assets we attach the
  // value of the asset.
  for (const asset of assets) {
    const price = prices.get(asset.typeString);
    if (price === undefined) {
      unknownAssets.push(asset);
    } else {
      const value = (asset.amount * price) / 10 ** asset.decimals!;
      knownAssets.push({value, ...asset});
    }
  }

  // Get the total value of the assets.
  const totalValue = knownAssets.reduce((acc, asset) => acc + asset.value, 0);

  return {
    totalValue,
    knownAssets,
    unknownAssets,
  };
}
