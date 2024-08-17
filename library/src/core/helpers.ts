import { AccountAddress, HexInput } from "@aptos-labs/ts-sdk";
import { Asset } from "./types";

export async function sequentialMap<T, K>(arr: T[], fn: (item: T) => Promise<K>): Promise<K[]> {
  const result: K[] = [];
  // eslint-disable-next-line no-await-in-loop,no-restricted-syntax
  for (const item of arr) result.push(await fn(item));
  return result;
}

export function ensureMillisecondTimestamp(timestamp: string): string {
  let sanitizedTimestamp = timestamp;
  if (sanitizedTimestamp.length > 13) {
    sanitizedTimestamp = sanitizedTimestamp.slice(0, 13);
  }
  if (sanitizedTimestamp.length === 10) {
    sanitizedTimestamp += "000";
  }
  return sanitizedTimestamp;
}

export function sum<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((acc, item) => acc + fn(item), 0);
}

export function checkAccountAddress(accountAddress: HexInput) {
  const result = AccountAddress.isValid({ input: accountAddress });
  if (!result.valid) {
    throw new Error(`Invalid account address: ${result.invalidReasonMessage}`);
  }
}

/**
 * Deduplicate assets by combining assets with the same typeString.
 */
export function deduplicateAssets(assets: Asset[]) {
  const assetMap = new Map<string, Asset>();
  for (const asset of assets) {
    const existing = assetMap.get(asset.typeString);
    if (existing) {
      existing.amount += asset.amount;
    } else {
      assetMap.set(asset.typeString, asset);
    }
  }
  return Array.from(assetMap.values());
}
