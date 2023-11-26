import { Aptos, AccountAddress, AccountAddressInput } from "@aptos-labs/ts-sdk";
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
  accountAddress: AccountAddressInput;
}): Promise<Asset[]> {
  const address = AccountAddress.from(accountAddress);
  const out = await client.getAccountCoinsData({ accountAddress: address });
  const assets: Asset[] = [];
  for (const coin of out) {
    assets.push({
      typeString: coin.asset_type,
      amount: coin.amount,
      decimals: coin.metadata?.decimals,
      prettyName: coin.metadata?.name,
    });
  }
  return assets;
}
