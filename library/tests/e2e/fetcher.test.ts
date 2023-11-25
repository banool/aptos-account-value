import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { fetchCoins, fetchStake } from "../../src/fetchers";

/* eslint no-console: 0 */
describe("Fetchers", () => {
  const config = new AptosConfig({ network: Network.MAINNET });
  const client = new Aptos(config);
  const accountAddress = "0x2f4624c9e2eb646a53d3a82666317a88c66df2119607a0ba6b56675225d97ced";

  test("Coin fetcher works", async () => {
    const coins = await fetchCoins({ client, accountAddress });
    console.log(JSON.stringify(coins, null, 2));
  });

  test("Staking fetcher works", async () => {
    const stake = await fetchStake({ client, accountAddress });
    console.log(JSON.stringify(stake, null, 2));
  });
});
