import { OutputCurrency, outputCurrencyToGeckoId } from "../core";
import { addressToGeckoId, geckoIdToAddress } from "./lookup";

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
  const ids = addresses.map((address) => addressToGeckoId[address]).join(",");
  const params = {
    ids,
    vs_currencies: outputCurrencyGeckoId,
  };
  const urlParams = new URLSearchParams(params).toString();

  // Use `fetch` to perform the GET request.
  const response = await fetch(`${url}?${urlParams}`);

  // Convert the response to JSON.
  const data = await response.json();

  const prices: Record<string, number> = {};

  Object.entries(data).forEach(([geckoId, mapValue]) => {
    const address = geckoIdToAddress[geckoId];
    const price = (mapValue as any)[outputCurrencyGeckoId as keyof typeof mapValue];
    prices[address] = price;
  });

  return prices;
}
