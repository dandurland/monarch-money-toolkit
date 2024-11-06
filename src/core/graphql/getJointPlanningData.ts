import { TypedDocumentNode, gql, useQuery } from "@apollo/client";
import { BudgetData, CategoryGroup } from "../monarch-money-api/model";
import { getMonarchDateString } from "toolkit/extension/utilities/date";

export interface JointPlanningData {
  budgetData: BudgetData;
  categoryGroups: CategoryGroup[];
}

export const GetJointPlanningData: TypedDocumentNode<JointPlanningData> = gql`query GetJointPlanningData($startDate: Date!, $endDate: Date!, $useLegacyGoals: Boolean!, $useV2Goals: Boolean!) {
  budgetData(startMonth: $startDate, endMonth: $endDate) {
    monthlyAmountsByCategory {
      category {
        id
        __typename
      }
      monthlyAmounts {
        month
        plannedCashFlowAmount
        plannedSetAsideAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        rolloverType
        __typename
      }
      __typename
    }
    monthlyAmountsByCategoryGroup {
      categoryGroup {
        id
        __typename
      }
      monthlyAmounts {
        month
        plannedCashFlowAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        rolloverType
        __typename
      }
      __typename
    }
    monthlyAmountsForFlexExpense {
      budgetVariability
      monthlyAmounts {
        month
        plannedCashFlowAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        rolloverType
        __typename
      }
      __typename
    }
    totalsByMonth {
      month
      totalIncome {
        plannedAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        __typename
      }
      totalExpenses {
        plannedAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        __typename
      }
      totalFixedExpenses {
        plannedAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        __typename
      }
      totalNonMonthlyExpenses {
        plannedAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        __typename
      }
      totalFlexibleExpenses {
        plannedAmount
        actualAmount
        remainingAmount
        previousMonthRolloverAmount
        __typename
      }
      __typename
    }
    __typename
  }
  categoryGroups {
    id
    name
    order
    groupLevelBudgetingEnabled
    budgetVariability
    rolloverPeriod {
      id
      startMonth
      endMonth
      startingBalance
      __typename
    }
    categories {
      id
      name
      icon
      order
      budgetVariability
      rolloverPeriod {
        id
        startMonth
        endMonth
        startingBalance
        __typename
      }
      __typename
    }
    type
    __typename
  }
  goals @include(if: $useLegacyGoals) {
    id
    name
    icon
    completedAt
    targetDate
    __typename
  }
  goalMonthlyContributions(startDate: $startDate, endDate: $endDate) @include(if: $useLegacyGoals) {
    amount: monthlyContribution
    startDate
    goalId
    __typename
  }
  goalPlannedContributions(startDate: $startDate, endDate: $endDate) @include(if: $useLegacyGoals) {
    id
    amount
    startDate
    goal {
      id
      __typename
    }
    __typename
  }
  goalsV2 @include(if: $useV2Goals) {
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
  budgetSystem
}`;

export function useGetJointPlanningData(startDate: Date, endDate: Date) {

  return useQuery<JointPlanningData>(GetJointPlanningData, {
    fetchPolicy: "no-cache",
    variables: {
      startDate: getMonarchDateString(startDate),
      endDate: getMonarchDateString(endDate),
      useLegacyGoals: false,
      useV2Goals: true
    }
  });
}

