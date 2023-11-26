import { useQueries, UseQueryResult } from "react-query";
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
  return useQueries(
    accountAddresses.map((address) => ({
      queryKey: ["getAccountValue", address, outputCurrency],
      queryFn: () =>
        getAccountValue({
          client: client,
          accountAddress: address,
          outputCurrency,
        }),
      enabled: accountAddresses.length > 0,
    })),
  );
}
