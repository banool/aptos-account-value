export type Asset = {
  unit: string;
  amount: number;
  prettyName?: string;
};

// In some functions we don't read the coin metadata. These constants are for common
// assets, so the keys match.
export const ASSET_APTOS_COIN = {
  unit: "0x1::aptos_coin::AptosCoin",
  prettyName: "Aptos Coin",
};
