import type { SuspenseQueryHookFetchPolicy, TypedDocumentNode, UseSuspenseQueryResult } from '@apollo/client';
import { gql, useBackgroundQuery, useQuery, useSuspenseQuery } from '@apollo/client';
import type { Account } from './models';

const DEFAULT_FETCH_POLICY = 'cache-and-network';

export interface AccountsData {
  accounts: Account[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  householdPreferences: any;
}

export const GetAccounts: TypedDocumentNode<AccountsData> = gql`
  query GetAccounts {
    accounts {
      ...AccountFields
      __typename
    }
    householdPreferences {
      id
      accountGroupOrder
      __typename
    }
  }

  fragment AccountFields on Account {
    id
    displayName
    syncDisabled
    deactivatedAt
    isHidden
    isAsset
    mask
    createdAt
    updatedAt
    displayLastUpdatedAt
    currentBalance
    displayBalance
    includeInNetWorth
    hideFromList
    hideTransactionsFromReports
    includeBalanceInNetWorth
    includeInGoalBalance
    dataProvider
    dataProviderAccountId
    isManual
    transactionsCount
    holdingsCount
    manualInvestmentsTrackingMethod
    order
    icon

    type {
      name
      display
      __typename
    }
    subtype {
      name
      display
      __typename
    }
    credential {
      id
      updateRequired
      disconnectedFromDataProviderAt
      dataProvider
      institution {
        id
        plaidInstitutionId
        name
        status

        __typename
      }
      __typename
    }
    institution {
      id
      name

      primaryColor
      url
      __typename
    }
    __typename
  }
`;

export function useGetAccounts(fetchPolicy?: SuspenseQueryHookFetchPolicy) {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useQuery<AccountsData>(GetAccounts, {
    fetchPolicy: fetchPolicy,
  });
}

export function useSuspenseGetAccounts(
  fetchPolicy?: SuspenseQueryHookFetchPolicy,
): UseSuspenseQueryResult<AccountsData> {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useSuspenseQuery<AccountsData>(GetAccounts, {
    fetchPolicy: fetchPolicy,
  });
}

export function useBackgroundGetAccounts(fetchPolicy?: SuspenseQueryHookFetchPolicy) {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useBackgroundQuery<AccountsData>(GetAccounts, {
    fetchPolicy: fetchPolicy,
  });
}
