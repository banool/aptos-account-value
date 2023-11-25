import { Aptos, HexInput } from "@aptos-labs/ts-sdk";
import { Asset, OutputCurrency } from "./core";
import { fetchCoins, fetchStake } from "./fetchers";
import { AppraiseResult, appraise } from "./appraiser";

export { appraise } from "./appraiser";

export async function getAccountValue({
  client,
  accountAddress,
  outputCurrency = OutputCurrency.USD,
}: {
  client: Aptos;
  accountAddress: HexInput;
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
