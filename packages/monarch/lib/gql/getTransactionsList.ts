import type { SuspenseQueryHookFetchPolicy, TypedDocumentNode, UseSuspenseQueryResult } from '@apollo/client';
import { gql, useQuery, useSuspenseQuery } from '@apollo/client';

import type { Transaction } from './models';

const DEFAULT_FETCH_POLICY = 'cache-and-network';

export interface TransactionFilter {
  search?: string;
  isPending?: boolean;
  categories?: string[];
  accounts?: string[];
  tags?: string[];
}

export interface TransactionQuery {
  filters?: TransactionFilter;
  limit?: number;
  orderBy?: string;
  offset?: number;
}

export interface TransactionData {
  allTransactions: {
    totalCount: number;
    totalSelectableCount: number;
    results: Transaction[];
  };
}

export function useGetTransactionsList(query?: TransactionQuery, fetchPolicy?: SuspenseQueryHookFetchPolicy) {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useQuery<TransactionData>(GetTransactionsList, {
    fetchPolicy: fetchPolicy,
    variables: query ?? {},
  });
}

export function useSuspenseGetTransactionsList(
  query?: TransactionQuery,
  fetchPolicy?: SuspenseQueryHookFetchPolicy,
): UseSuspenseQueryResult<TransactionData> {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useSuspenseQuery<TransactionData>(GetTransactionsList, {
    fetchPolicy: fetchPolicy,
    variables: query ?? {},
  });
}

export const GetTransactionsList: TypedDocumentNode<TransactionData> = gql`
  query Web_GetTransactionsList(
    $offset: Int
    $limit: Int
    $filters: TransactionFilterInput
    $orderBy: TransactionOrdering
  ) {
    allTransactions(filters: $filters) {
      totalCount
      totalSelectableCount
      results(offset: $offset, limit: $limit, orderBy: $orderBy) {
        id
        ...TransactionOverviewFields
        __typename
      }
      __typename
    }
    transactionRules {
      id
      __typename
    }
  }

  fragment TransactionOverviewFields on Transaction {
    id
    amount
    pending
    date
    hideFromReports
    plaidName
    notes
    isRecurring
    reviewStatus
    needsReview
    isSplitTransaction
    dataProviderDescription
    attachments {
      id
      __typename
    }
    category {
      id
      name
      icon
      group {
        id
        type
        __typename
      }
      __typename
    }
    merchant {
      name
      id
      transactionsCount
      logoUrl
      recurringTransactionStream {
        frequency
        isActive
        __typename
      }
      __typename
    }
    tags {
      id
      name
      color
      order
      __typename
    }
    account {
      id
      displayName
      icon
      logoUrl
      __typename
    }
    __typename
  }
`;
