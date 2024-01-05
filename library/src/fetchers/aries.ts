/* eslint guard-for-in: 0 */

import { AccountAddressInput } from "@aptos-labs/ts-sdk";
import { Asset } from "../core/types";

/**
 * Get all the assets currently lent in Aries. This will include any earnings from
 * lending. It is necessary to have a separate fetcher because when you deposit to
 * Aries, it doesn't give you an equivalent coin, the data is stored elsewhere on
 * chain. So this fetcher uses their API instead.
 */
export async function fetchAriesDeposits({
  accountAddress,
}: {
  accountAddress: AccountAddressInput;
}): Promise<Asset[]> {
  const url = "https://api-v2.ariesmarkets.xyz/profile.find";
  const params = {
    owner: accountAddress,
  };
  let response;
  try {
    response = await fetch(`${url}?input=${encodeURIComponent(JSON.stringify(params))}`);
  } catch (e) {
    // This account must not have an account with Aries.
    return [];
  }

  const json = await response.json();
  const assets: Asset[] = [];
  for (const profile in json.result.data.profiles) {
    const profileData = json.result.data.profiles[profile];
    for (const deposit in profileData.deposits) {
      const depositData = profileData.deposits[deposit];
      // Decimals is not given so we don't set it, the appraiser will look it up.
      assets.push({
        typeString: deposit,
        amount: Math.floor(depositData.collateral_coins),
        prettyName: `${deposit.split("::")[2]} (Aries)`,
      });
    }
  }
  return assets;
}
