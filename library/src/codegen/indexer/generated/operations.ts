import * as Types from "./types";

export type GetDelegatedStakingQueryVariables = Types.Exact<{
  address: Types.Scalars["String"];
}>;

export type GetDelegatedStakingQuery = {
  __typename?: "query_root";
  delegator_distinct_pool: Array<{
    __typename?: "delegator_distinct_pool";
    delegator_address?: string | null;
    pool_address?: string | null;
    current_pool_balance?: {
      __typename?: "current_delegated_staking_pool_balances";
      operator_commission_percentage: any;
    } | null;
    staking_pool_metadata?: {
      __typename?: "current_staking_pool_voter";
      operator_address: string;
      operator_aptos_name: Array<{ __typename?: "current_aptos_names"; domain?: string | null }>;
    } | null;
  }>;
};

export type GetDelegatedStakingRoyaltiesQueryVariables = Types.Exact<{
  address: Types.Scalars["String"];
  pool?: Types.InputMaybe<Types.Scalars["String"]>;
}>;

export type GetDelegatedStakingRoyaltiesQuery = {
  __typename?: "query_root";
  delegated_staking_activities: Array<{
    __typename?: "delegated_staking_activities";
    amount: any;
    delegator_address: string;
    event_index: any;
    event_type: string;
    pool_address: string;
    transaction_version: any;
  }>;
};
