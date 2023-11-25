import { Asset, OutputCurrency } from "../core/types";

/**
 *
 * This function takes in a list of Assets and returns their value in the requested
 * currency.
 */
export function appraise({
  assets,
  outputCurrency = OutputCurrency.USD,
}: {
  assets: Asset[];
  outputCurrency: OutputCurrency;
}): number {
  return 0;
}
