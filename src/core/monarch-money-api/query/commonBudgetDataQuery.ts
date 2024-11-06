
export const CommonBudgetDataQuery = `query Common_BudgetDataQuery(
    $date: Date!
    $endOfMonth: Date!
    $cacheKey: String!
    $useLegacyGoals: Boolean!
    $useV2Goals: Boolean!
  ) {
    cacheKey(cacheKey: $cacheKey)
    budgetSystem
    budgetData(startMonth: $date, endMonth: $date) {
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
      monthlyAmountsByCategory {
        category {
          id
          name
          __typename
        }
        monthlyAmounts {
          ...BudgetDataMonthlyAmountsFragment
          __typename
        }
        __typename
      }
      __typename
    }
    categoryGroups {

      rolloverPeriod {

        __typename
      }
      categories {
        ...BudgetCategoryFields
        __typename
      }
      id
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
    goalMonthlyContributions(startDate: $date, endDate: $endOfMonth)
      @include(if: $useLegacyGoals) {
      amount: monthlyContribution
      startDate
      goalId
      __typename
    }
    goalPlannedContributions(startDate: $date, endDate: $endOfMonth)
      @include(if: $useLegacyGoals) {
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
      plannedContributions(startMonth: $date, endMonth: $endOfMonth) {
        id
        month
        amount
        __typename
      }
      monthlyContributionSummaries(startMonth: $date, endMonth: $endOfMonth) {
        month
        sum
        __typename
      }
      __typename
    }
  }

  fragment BudgetDataMonthlyAmountsFragment on BudgetMonthlyAmounts {
    actualAmount
    plannedCashFlowAmount
    remainingAmount
    previousMonthRolloverAmount
    rolloverType
    __typename
  }

  fragment BudgetCategoryFields on Category {

    group {
      id
      type
      __typename
    }
    id
    name
    __typename
  }`;