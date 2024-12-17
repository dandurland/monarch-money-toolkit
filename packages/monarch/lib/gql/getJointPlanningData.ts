import type {
  OperationVariables,
  SuspenseQueryHookFetchPolicy,
  TypedDocumentNode,
  UseSuspenseQueryResult,
} from '@apollo/client';
import { gql, useBackgroundQuery, useQuery, useSuspenseQuery } from '@apollo/client';
import { makeMonarchDate } from '../make-monarch-date';
import type { BudgetData, CategoryGroup } from './models';

const DEFAULT_FETCH_POLICY = 'cache-and-network';

export interface JointPlanningData {
  budgetData: BudgetData;
  categoryGroups: CategoryGroup[];
}

export const GetJointPlanningData: TypedDocumentNode<JointPlanningData> = gql`
  query Common_GetJointPlanningData($startDate: Date!, $endDate: Date!) {
    budgetSystem
    budgetData(startMonth: $startDate, endMonth: $endDate) {
      ...BudgetDataFields
      __typename
    }
    categoryGroups {
      ...BudgetCategoryGroupFields
      __typename
    }
    goalsV2 {
      ...BudgetDataGoalsV2Fields
      __typename
    }
  }

  fragment BudgetDataMonthlyAmountsFields on BudgetMonthlyAmounts {
    month
    plannedCashFlowAmount
    plannedSetAsideAmount
    actualAmount
    remainingAmount
    previousMonthRolloverAmount
    rolloverType
    cumulativeActualAmount
    rolloverTargetAmount
    __typename
  }

  fragment BudgetMonthlyAmountsByCategoryFields on BudgetCategoryMonthlyAmounts {
    category {
      id
      name
      icon
      __typename
    }
    monthlyAmounts {
      ...BudgetDataMonthlyAmountsFields
      __typename
    }
    __typename
  }

  fragment BudgetMonthlyAmountsByCategoryGroupFields on BudgetCategoryGroupMonthlyAmounts {
    categoryGroup {
      id
      __typename
    }
    monthlyAmounts {
      ...BudgetDataMonthlyAmountsFields
      __typename
    }
    __typename
  }

  fragment BudgetMonthlyAmountsForFlexExpenseFields on BudgetFlexMonthlyAmounts {
    budgetVariability
    monthlyAmounts {
      ...BudgetDataMonthlyAmountsFields
      __typename
    }
    __typename
  }

  fragment BudgetDataTotalsByMonthFields on BudgetTotals {
    actualAmount
    plannedAmount
    previousMonthRolloverAmount
    remainingAmount
    __typename
  }

  fragment BudgetTotalsByMonthFields on BudgetMonthTotals {
    month
    totalIncome {
      ...BudgetDataTotalsByMonthFields
      __typename
    }
    totalExpenses {
      ...BudgetDataTotalsByMonthFields
      __typename
    }
    totalFixedExpenses {
      ...BudgetDataTotalsByMonthFields
      __typename
    }
    totalNonMonthlyExpenses {
      ...BudgetDataTotalsByMonthFields
      __typename
    }
    totalFlexibleExpenses {
      ...BudgetDataTotalsByMonthFields
      __typename
    }
    __typename
  }

  fragment BudgetRolloverPeriodFields on BudgetRolloverPeriod {
    id
    startMonth
    endMonth
    startingBalance
    targetAmount
    frequency
    type
    __typename
  }

  fragment BudgetCategoryFields on Category {
    id
    name
    icon
    order
    budgetVariability
    excludeFromBudget
    isSystemCategory
    updatedAt
    group {
      id
      type
      budgetVariability
      groupLevelBudgetingEnabled
      __typename
    }
    rolloverPeriod {
      ...BudgetRolloverPeriodFields
      __typename
    }
    __typename
  }

  fragment BudgetDataFields on BudgetData {
    monthlyAmountsByCategory {
      ...BudgetMonthlyAmountsByCategoryFields
      __typename
    }
    monthlyAmountsByCategoryGroup {
      ...BudgetMonthlyAmountsByCategoryGroupFields
      __typename
    }
    monthlyAmountsForFlexExpense {
      ...BudgetMonthlyAmountsForFlexExpenseFields
      __typename
    }
    totalsByMonth {
      ...BudgetTotalsByMonthFields
      __typename
    }
    __typename
  }

  fragment BudgetCategoryGroupFields on CategoryGroup {
    id
    name
    order
    type
    budgetVariability
    updatedAt
    groupLevelBudgetingEnabled
    categories {
      ...BudgetCategoryFields
      __typename
    }
    rolloverPeriod {
      id
      type
      startMonth
      endMonth
      startingBalance
      frequency
      targetAmount
      __typename
    }
    __typename
  }

  fragment BudgetDataGoalsV2Fields on GoalV2 {
    id
    name
    archivedAt
    completedAt
    priority
    imageStorageProvider
    imageStorageProviderId
    plannedContributions(startMonth: $startDate, endMonth: $endDate) {
      id
      month
      amount
      __typename
    }
    monthlyContributionSummaries(startMonth: $startDate, endMonth: $endDate) {
      month
      sum
      __typename
    }
    __typename
  }
`;

export function useGetJointPlanningData(startDate: Date, endDate: Date, fetchPolicy?: SuspenseQueryHookFetchPolicy) {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useQuery<JointPlanningData>(GetJointPlanningData, {
    fetchPolicy: fetchPolicy,
    variables: {
      startDate: makeMonarchDate(startDate),
      endDate: makeMonarchDate(endDate),
    },
  });
}

export function useSuspenseGetJointPlanningData(
  startDate: Date,
  endDate: Date,
  fetchPolicy?: SuspenseQueryHookFetchPolicy,
): UseSuspenseQueryResult<JointPlanningData, OperationVariables> {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useSuspenseQuery<JointPlanningData>(GetJointPlanningData, {
    fetchPolicy: fetchPolicy,
    variables: {
      startDate: makeMonarchDate(startDate),
      endDate: makeMonarchDate(endDate),
    },
  });
}

export function useBackgroundGetJointPlanningData(
  startDate: Date,
  endDate: Date,
  fetchPolicy?: SuspenseQueryHookFetchPolicy,
) {
  if (!fetchPolicy) {
    fetchPolicy = DEFAULT_FETCH_POLICY;
  }

  return useBackgroundQuery<JointPlanningData>(GetJointPlanningData, {
    fetchPolicy: fetchPolicy,
    variables: {
      startDate: makeMonarchDate(startDate),
      endDate: makeMonarchDate(endDate),
    },
  });
}
