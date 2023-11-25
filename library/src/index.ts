import { AccountAddressInput, Aptos } from "@aptos-labs/ts-sdk";
import { Asset, OutputCurrency } from "./core";
import { fetchCoins, fetchStake } from "./fetchers";
import { AppraiseResult, appraise } from "./appraiser";

export { AppraiseResult } from "./appraiser";
export { Asset, OutputCurrency } from "./core";

export async function getAccountValue({
  client,
  accountAddress,
  outputCurrency = OutputCurrency.USD,
}: {
  client: Aptos;
  accountAddress: AccountAddressInput;
  outputCurrency?: OutputCurrency;
}): Promise<AppraiseResult> {
  // Fetch assets on the account.
  const assets: Asset[] = [];
  assets.push(...(await fetchCoins({ client, accountAddress })));
  assets.push(...(await fetchStake({ client, accountAddress })));

  // Get the value of the assets.
  const out = await appraise({
    assets,
    outputCurrency,
  });

  return out;
}
