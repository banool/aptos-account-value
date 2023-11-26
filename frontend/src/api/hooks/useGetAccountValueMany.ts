import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AccountAddressInput, AccountAddress, Aptos } from "@aptos-labs/ts-sdk";
import {
  AppraiseResult,
  OutputCurrency,
  getAccountValueMany,
} from "@banool/aptos-account-value";

export function useGetAccountValueMany({
  client,
  accountAddresses,
  outputCurrency,
}: {
  client: Aptos;
  accountAddresses: AccountAddressInput[];
  outputCurrency?: OutputCurrency;
}): UseQueryResult<Map<string, AppraiseResult>> {
  const validAccountAddresses = accountAddresses.filter(
    (address) => AccountAddress.isValid({ input: address }).valid,
  );

  console.log("useGetAccountValueMany", validAccountAddresses);

  return useQuery({
    queryKey: ["getAccountValue", validAccountAddresses, outputCurrency],
    queryFn: () =>
      getAccountValueMany({
        client: client,
        accountAddresses: validAccountAddresses,
        outputCurrency,
      }),
    enabled: validAccountAddresses.length > 0,
    retry: 2,
  });
}

// TODO: I need to fix the error return here, the UI shows nothing.
// TODO: Batch calls to CoinGecko, expose a single getAccountValueMany function in the library.
