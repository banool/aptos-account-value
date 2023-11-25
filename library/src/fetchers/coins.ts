import { Aptos, AccountAddress, HexInput } from "@aptos-labs/ts-sdk";
import { Asset } from "../core/types";

/**
 * Get all the coins owned by the account.
 *
 * TODO: I'm not sure if this includes fungible assets.
 */
export async function fetchCoins({
  client,
  accountAddress,
}: {
  client: Aptos;
  accountAddress: HexInput;
}): Promise<Asset[]> {
  const address = AccountAddress.from(accountAddress);
  const out = await client.getAccountCoinsData({ accountAddress: address });
  const assets: Asset[] = [];
  for (const coin of out) {
    assets.push({
      unit: coin.asset_type,
      amount: coin.amount,
      prettyName: coin.metadata?.name,
    });
  }
  return assets;
}
