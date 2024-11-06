import { TypedDocumentNode, gql } from "@apollo/client";
import { Account } from "../monarch-money-api/model";

interface AccountsResult {
  accounts: Account[];
  householdPreferences: any;
};

export const GetAccounts: TypedDocumentNode<AccountsResult> = gql`query GetAccounts {
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
}`;