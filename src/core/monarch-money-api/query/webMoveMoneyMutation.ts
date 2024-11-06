
export const WebMoveMoneyMutation = `mutation Web_MoveMoneyMutation($input: MoveMoneyMutationInput!) {
    moveMoneyBetweenCategories(input: $input) {
      fromBudgetItem {
        id
        budgetAmount
        __typename
      }
      toBudgetItem {
        id
        budgetAmount
        __typename
      }
      __typename
    }
  }`;