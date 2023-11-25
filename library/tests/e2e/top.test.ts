import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { getAccountValue } from "../../src";

/* eslint no-console: 0 */
describe("Top", () => {
  const config = new AptosConfig({ network: Network.MAINNET });
  const client = new Aptos(config);
  const accountAddress = "0x2f4624c9e2eb646a53d3a82666317a88c66df2119607a0ba6b56675225d97ced";

  test("getAccountValue works", async () => {
    const result = await getAccountValue({ client, accountAddress });
    console.log(JSON.stringify(result, null, 2));
  });
});
