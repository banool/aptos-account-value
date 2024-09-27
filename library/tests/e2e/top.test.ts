import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { getAccountValueMany } from "../../src";

/* eslint no-console: 0 */
describe("Top", () => {
  const config = new AptosConfig({ network: Network.MAINNET });
  const client = new Aptos(config);
  const accountAddress = "0x232098630cfad4734812fa37dc18d9b8d59242feabe49259e26318d468a99584";

  test("getAccountValue works", async () => {
    const result = await getAccountValueMany({ client, accountAddresses: [accountAddress] });
    console.log("Top level result", JSON.stringify(Object.fromEntries(result.entries()), null, 2));
  }, 30000);
});
