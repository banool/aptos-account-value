import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { fetchCoins, fetchStake } from "../../src/fetchers";
import { fetchCellanaDeposits } from "../../src/fetchers/cellana";

/* eslint no-console: 0 */
describe("Fetchers", () => {
  const config = new AptosConfig({ network: Network.MAINNET, clientConfig: { API_KEY: process.env.API_KEY } });
  const client = new Aptos(config);
  const accountAddress = "0x2f4624c9e2eb646a53d3a82666317a88c66df2119607a0ba6b56675225d97ced";

  test("Coin fetcher works", async () => {
    const coins = await fetchCoins({ client, accountAddress });
    console.log("Coins", JSON.stringify(coins, null, 2));
  });

  test("Staking fetcher works", async () => {
    const stake = await fetchStake({ client, accountAddress });
    console.log("Stake", JSON.stringify(stake, null, 2));
  });

  test("Cellana fetcher works", async () => {
    const assets = await fetchCellanaDeposits({
      client,
      accountAddress: "0x232098630cfad4734812fa37dc18d9b8d59242feabe49259e26318d468a99584",
    });
    console.log("Cellana", JSON.stringify(assets, null, 2));
  }, 30000);
});
