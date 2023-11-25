import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { fetchCoins, fetchStake } from "../../src/fetchers";

/* eslint no-console: 0 */
describe("Fetchers", () => {
  const config = new AptosConfig({ network: Network.MAINNET });
  const client = new Aptos(config);
  const accountAddress = "0xe9c4ac5a59bdee5b23715e5d1ab0486c199eddc7572148843a6ca816320b8f22";

  test("Coin fetcher works", async () => {
    const coins = await fetchCoins({ client, accountAddress });
    console.log(JSON.stringify(coins, null, 2));
  });

  test("Staking fetcher works", async () => {
    const stake = await fetchStake({ client, accountAddress });
    console.log(JSON.stringify(stake, null, 2));
  });
});
