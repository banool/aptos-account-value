import * as Types from "./operations";

import { GraphQLClient } from "graphql-request";
import * as Dom from "graphql-request/dist/types.dom";

export const GetDelegatedStaking = `
    query getDelegatedStaking($address: String!) {
  delegator_distinct_pool(where: {delegator_address: {_eq: $address}}) {
    delegator_address
    pool_address
    current_pool_balance {
      operator_commission_percentage
    }
    staking_pool_metadata {
      operator_address
      operator_aptos_name {
        domain
      }
    }
  }
}
    `;
export const GetDelegatedStakingRoyalties = `
    query getDelegatedStakingRoyalties($address: String!, $pool: String) {
  delegated_staking_activities(
    where: {delegator_address: {_eq: $address}, pool_address: {_eq: $pool}}
    order_by: {transaction_version: desc}
  ) {
    amount
    delegator_address
    event_index
    event_type
    pool_address
    transaction_version
  }
}
    `;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getDelegatedStaking(
      variables: Types.GetDelegatedStakingQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"],
    ): Promise<Types.GetDelegatedStakingQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetDelegatedStakingQuery>(GetDelegatedStaking, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "getDelegatedStaking",
        "query",
      );
    },
    getDelegatedStakingRoyalties(
      variables: Types.GetDelegatedStakingRoyaltiesQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"],
    ): Promise<Types.GetDelegatedStakingRoyaltiesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetDelegatedStakingRoyaltiesQuery>(GetDelegatedStakingRoyalties, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "getDelegatedStakingRoyalties",
        "query",
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
