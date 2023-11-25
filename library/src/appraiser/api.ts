import { OutputCurrency, outputCurrencyToGeckoId } from "../core";
import { addressToGeckoId, geckoIdToAddresses } from "./lookup";

// TODO: There should be multiple ways to look up the price for an asset, and a top
// level lookup to guide that.

const url = "https://api.coingecko.com/api/v3/simple/price";

/**
 * Given a list of addresses of assets on chain, return their prices in the requested
 * output currency. The key of the output map will be given address, not the gecko ID.
 */
export async function getPrices({
  addresses,
  outputCurrency,
}: {
  addresses: string[];
  outputCurrency: OutputCurrency;
}): Promise<Record<string, number>> {
  const outputCurrencyGeckoId = outputCurrencyToGeckoId(outputCurrency);
  // Filter out addresses that we don't have entries for in the lookup.
  const ids = addresses
    .map((address) => addressToGeckoId[address])
    .filter((address) => address !== undefined)
    .join(",");

  const params = {
    ids,
    vs_currencies: outputCurrencyGeckoId,
  };
  const urlParams = new URLSearchParams(params).toString();

  const response = await fetch(`${url}?${urlParams}`);

  const data = await response.json();

  const prices: Record<string, number> = {};

  Object.entries(data).forEach(([geckoId, mapValue]) => {
    const addrs = geckoIdToAddresses[geckoId];
    const price = (mapValue as any)[outputCurrencyGeckoId as keyof typeof mapValue];
    for (const address of addrs) {
      prices[address] = price;
    }
  });

  return prices;
}
