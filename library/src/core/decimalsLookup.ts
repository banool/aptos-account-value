import { Aptos } from "@aptos-labs/ts-sdk";
import { Asset } from "./types";

/**
 * Attach decimal information to Assets where decimals is not set. At first, try to
 * find the information from other assets of the same type. If that fails, look it up.
 *
 * This function mutates the given assets in place.
 */
export async function attachDecimalInformation({ client, assets }: { client: Aptos; assets: Asset[] }) {
  // Build the decimalsLookup map based on what we've already got.
  const decimalsLookup = new Map<string, number>();
  for (const asset of assets) {
    if (asset.decimals !== undefined) {
      // Confirm any existing decimals data doesn't conflict.
      if (decimalsLookup.has(asset.typeString)) {
        if (decimalsLookup.get(asset.typeString) !== asset.decimals) {
          throw new Error(`Conflicting decimals data for ${asset.typeString}`);
        }
      }
      decimalsLookup.set(asset.typeString, asset.decimals);
    }
  }

  // Lookup decimals data for any Assets where it's missing.
  const assetsToLookup = assets.filter((asset) => asset.decimals === undefined);
  const typeStringsToLookup = new Set<string>(assetsToLookup.map((asset) => asset.typeString));
  for (const assetTypeString of typeStringsToLookup) {
    // eslint-disable-next-line no-await-in-loop
    const decimals = await lookUpDecimals({ client, assetTypeString });
    decimalsLookup.set(assetTypeString, decimals);
  }

  // Attach decimals information to Assets where it's missing.
  for (const asset of assets) {
    if (asset.decimals === undefined) {
      const decimals = decimalsLookup.get(asset.typeString);
      if (decimals === undefined) {
        throw new Error(`Decimals data still missing for ${asset.typeString}, this should be impossible`);
      }
      asset.decimals = decimals;
    }
  }
}

async function lookUpDecimals({
  client,
  assetTypeString,
}: {
  client: Aptos;
  assetTypeString: string;
}): Promise<number> {
  const assetType = await client.getFungibleAssetMetadataByAssetType({ assetType: assetTypeString });
  return assetType.decimals;
}
