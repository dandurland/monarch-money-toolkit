import { gql, useMutation } from "@apollo/client";
import { getMonarchDateString } from "toolkit/extension/utilities/date";

export enum TimeFrame {
  month
}

export interface WebMoveMoneyMutationInput {
  startDate: string;
  timeframe: string;
  fromCategoryId: string;
  toCategoryId: string;
  amount: number;
}

export const WebMoveMoneyMutation = gql`mutation Web_MoveMoneyMutation($input: MoveMoneyMutationInput!) {
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

export function useWebMoveMoneyMutation(remainingAmount: number, fromCategoryId: string, toCategoryId: string, startDate: Date, refetchQueries?: any[]) {

  const [mutate, { data, loading, error }] = useMutation(WebMoveMoneyMutation, {
    variables:
    {
      input: {
        amount: remainingAmount,
        fromCategoryId: fromCategoryId,
        startDate: getMonarchDateString(startDate),
        timeframe: TimeFrame[TimeFrame.month],
        toCategoryId: toCategoryId
      }
    },
    awaitRefetchQueries: true,
    refetchQueries: refetchQueries
  });

  return { mutate, data, error };
}