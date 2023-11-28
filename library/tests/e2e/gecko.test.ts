import { getPrices } from "../../src/appraisers/gecko/api";
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
    const pricesObject = Object.fromEntries(prices.entries());
    console.log("prices", JSON.stringify(pricesObject));
    // Assert that the two addresses are in the output.
    expect(pricesObject).toHaveProperty("0x1::aptos_coin::AptosCoin");
    expect(pricesObject).toHaveProperty(
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
    );
  });
});
