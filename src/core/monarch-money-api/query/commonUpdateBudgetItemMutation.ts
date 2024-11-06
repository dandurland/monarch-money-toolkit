export const CommonUpdateBudgetItemMutation = `mutation Common_UpdateBudgetItem($input: UpdateOrCreateBudgetItemMutationInput!) {
    updateOrCreateBudgetItem(input: $input) {
      budgetItem {
        id
        budgetAmount
        __typename
      }
      __typename
    }
  }`;