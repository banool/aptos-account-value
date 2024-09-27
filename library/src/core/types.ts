// For now this assumes you're dealing with coins / fungible assets. We will need to
// refactor if we want to consider other assets, e.g. NFTs.
export type Asset = {
  /** For example, 0x1::aptos_coin::AptosCoin. */
  typeString: string;
  /** If not given, we will look it up. */
  decimals?: number;
  /** For example, Aptos Coin. */
  prettyName?: string;
  /**
   * Amount in the on chain unit, e.g. OCTA for APT. We convert for the appraiser
   * lookup using `decimals` if necessary.
   */
  amount: number;
};

export type AppraisedAsset = Asset & {
  /** The value of the asset in the requested currency. */
  value: number;
};

export const APT_DECIMALS = 8;

// In some functions we don't read the coin metadata. These constants are for common
// assets, so the keys match.
export const ASSET_APTOS_COIN = {
  address: "0x1::aptos_coin::AptosCoin",
  decimals: APT_DECIMALS,
  prettyName: "Aptos Coin",
};

export enum OutputCurrency {
  USD = "USD",
  APT = "APT",
}

export function outputCurrencyToGeckoId(currency: OutputCurrency): string {
  switch (currency) {
    case OutputCurrency.USD:
      return "usd";
    case OutputCurrency.APT:
      return "aptos";
    default: {
      // If the default case is reached, TypeScript will enforce that 'currency' must be 'never'
      // This line will cause a compile-time error if there are any unhandled enum cases.
      const exhaustiveCheck: never = currency;
      throw new Error(`Invalid output currency: ${exhaustiveCheck}`);
    }
  }
}
