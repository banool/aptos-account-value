import { getPrices } from "../../src/appraiser/api";
import { OutputCurrency } from "../../src/core";

/* eslint no-console: 0 */
describe("Appraiser", () => {
  test("getPrices works", async () => {
    const prices = await getPrices({
      addresses: [
        "0x1::aptos_coin::AptosCoin",
        "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
      ],
      outputCurrency: OutputCurrency.USD,
    });
    console.log(JSON.stringify(prices, null, 2));
    // Assert that the two addresses are in the output.
    expect(Object.keys(prices)).toContain("0x1::aptos_coin::AptosCoin");
    expect(Object.keys(prices)).toContain(
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
    );
  });
});
