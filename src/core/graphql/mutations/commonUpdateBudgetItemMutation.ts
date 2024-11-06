import { gql, useMutation } from "@apollo/client";
import { TimeFrame } from "./webMoveMoneyMutation";
import { getMonarchDateString } from "toolkit/extension/utilities/date";


export interface UpdateBudgetItemInput {
  amount: number,
  categoryId: string,
  startDate: string,
  timeframe: string,
  applyToFuture: boolean
}

export const CommonUpdateBudgetItemMutation = gql`mutation Common_UpdateBudgetItem($input: UpdateOrCreateBudgetItemMutationInput!) {
    updateOrCreateBudgetItem(input: $input) {
      budgetItem {
        id
        budgetAmount
        __typename
      }
      __typename
    }
  }`;

export function useCommonUpdateBudgetItemMutation(amount: number, categoryId: string, startDate: Date, applyToFuture: boolean, refetchQueries?: any[]) {

  return useMutation(CommonUpdateBudgetItemMutation, {
    variables:
    {
      input: {
        amount: amount,
        categoryId: categoryId,
        startDate: getMonarchDateString(startDate),
        timeframe: TimeFrame[TimeFrame.month],
        applyToFuture: applyToFuture
      }
    },
    awaitRefetchQueries: true,
    refetchQueries: refetchQueries
  });
}