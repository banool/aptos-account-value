export type SingleLookup = {
  address: string;
  geckoId: string;
};

// Thanks to alfar0x for the initial version of this lookup:
// https://github.com/alfar0x/aptos-accounts-checker/blob/f37924d0a8400c1e6f830dca7c35124a57c41763/src/common/tokens.ts#L17
const data: SingleLookup[] = [
  {
    address: "0x1::aptos_coin::AptosCoin",
    geckoId: "aptos",
  },
  {
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
    geckoId: "usd-coin",
  },
  {
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
    geckoId: "tether",
  },
  {
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
    geckoId: "weth",
  },
  {
    address: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos",
    geckoId: "ditto-staked-aptos",
  },
  {
    address: "0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin",
    geckoId: "tortuga-staked-aptos",
  },
  {
    address: "0x8d87a65ba30e09357fa2edea2c80dbac296e5dec2b18287113500b902942929d::celer_coin_manager::WbtcCoin",
    geckoId: "wrapped-bitcoin",
  },
];

export const addressToGeckoId = data.reduce((acc: Record<string, string>, { geckoId, address }) => {
  acc[address] = geckoId;
  return acc;
}, {});

export const geckoIdToAddress = data.reduce((acc: Record<string, string>, { geckoId, address }) => {
  acc[geckoId] = address;
  return acc;
}, {});
