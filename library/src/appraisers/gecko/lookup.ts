type Lookup = {
  address: string;
  geckoId: string;
};

// Thanks to alfar0x for the initial version of this lookup:
// https://github.com/alfar0x/aptos-accounts-checker/blob/f37924d0a8400c1e6f830dca7c35124a57c41763/src/common/tokens.ts#L17
const data: Lookup[] = [
  {
    address: "0x1::aptos_coin::AptosCoin",
    geckoId: "aptos",
  },
  // Layer Zero USDC
  {
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
    geckoId: "usd-coin",
  },
  // Wormhole USDC
  {
    address: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
    geckoId: "usd-coin",
  },
  // Layer Zero USDT
  {
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
    geckoId: "tether",
  },
  // Worhome USDT
  {
    address: "0xa2eda21a58856fda86451436513b867c97eecb4ba099da5775520e0f7492e852::coin::T",
    geckoId: "tether",
  },
  // Layer Zero WETH
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
  // Amnis Staked Aptos Coin
  {
    address: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::stapt_token::StakedApt",
    geckoId: "amnis-staked-aptos-coin",
  },
  // Amnis Aptos
  {
    address: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a::amapt_token::AmnisApt",
    geckoId: "amnis-aptos",
  },
  // Cellana. Fungible Asset, for now I just store the address of the FA metadata.
  {
    address: "0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12",
    geckoId: "cellana-finance",
  },
];

// Throw an error if there are any duplicate addresses. Multiple addresses mapping to
// the same geckoId is fine though.
const addresses = data.map(({ address }) => address);
const uniqueAddresses = new Set(addresses);
if (addresses.length !== uniqueAddresses.size) {
  throw new Error("Duplicate addresses found in lookup");
}

export const addressToGeckoId = data.reduce((acc: Record<string, string>, { geckoId, address }) => {
  acc[address] = geckoId;
  return acc;
}, {});

export const geckoIdToAddresses = data.reduce((acc: Record<string, string[]>, { geckoId, address }) => {
  if (acc[geckoId] === undefined) {
    acc[geckoId] = [];
  }
  acc[geckoId].push(address);
  return acc;
}, {});
