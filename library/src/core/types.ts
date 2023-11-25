export type Asset = {
  address: string;
  decimals?: number;
  prettyName?: string;
  amount: number;
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
  APT = "APT",
  USD = "USD",
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
