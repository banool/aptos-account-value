import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { AccountAddressInput, Aptos } from "@aptos-labs/ts-sdk";
import {
  AppraiseResult,
  OutputCurrency,
  getAccountValue,
} from "@banool/aptos-account-value";

export function useGetAccountValueMany({
  client,
  accountAddresses,
  outputCurrency,
}: {
  client: Aptos;
  accountAddresses: AccountAddressInput[];
  outputCurrency?: OutputCurrency;
}): UseQueryResult<AppraiseResult>[] {
  return useQueries({
    queries: accountAddresses.map((address) => ({
      queryKey: ["getAccountValue", address, outputCurrency],
      queryFn: () =>
        getAccountValue({
          client: client,
          accountAddress: address,
          outputCurrency,
        }),
      enabled: accountAddresses.length > 0,
      retry: 2,
    })),
  });
}

// TODO: I need to fix the error return here, the UI shows nothing.
// TODO: Batch calls to CoinGecko, expose a single getAccountValueMany function in the library.
