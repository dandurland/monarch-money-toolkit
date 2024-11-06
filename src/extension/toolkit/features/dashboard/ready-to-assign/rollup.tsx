import { DocumentNode, useApolloClient } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { $FlatButton } from "toolkit/components/styles/widget-styles.sc";
import { BudgetRollupData } from "toolkit/core/calculators/budgetRollupCalculator";
import { CommonUpdateBudgetItemMutation, UpdateBudgetItemInput } from "toolkit/core/graphql/mutations/commonUpdateBudgetItemMutation";
import { TimeFrame, WebMoveMoneyMutation, WebMoveMoneyMutationInput } from "toolkit/core/graphql/mutations/webMoveMoneyMutation";
import { ThemePreference } from "toolkit/core/utilities/monarchSettings";
import { Month } from "toolkit/extension/utilities/date";

export interface RollupData {
  theme: ThemePreference,
  budgetData: BudgetRollupData | null;
  rollupCategoryId: string;
  currentMonth: Month;
  lastMonth: Month
}

export function RollupComponent({ data }: { data: RollupData }) {

  const isDark = data.theme === ThemePreference.dark;
  const [isRollingUp, setIsRollingUp] = useState(false);

  const client = useApolloClient();

  const onRollupClicked = async () => {

    setIsRollingUp(true);
    
    try {

      const mutations = getMutations(data.budgetData, data.rollupCategoryId, data.currentMonth, data.lastMonth);

      for (const mutation of mutations) {

        const result = await client.mutate({
          variables: {
            input: mutation.input
          },
          mutation: mutation.query
        });
        console.log(result);
      }

    } catch (e: any) {
      console.log(e)
    } finally {
      setIsRollingUp(false);
    }
  }

  return (
    <$FlatButton $color={"#32AAF0"} $ghost={isDark} onClick={() => onRollupClicked()}>Rollup Last Month</$FlatButton>
  )
}

interface Mutation {
  query: DocumentNode,
  input: any
};

function getMutations(data: BudgetRollupData | null, rollupCategoryId: string, currentMonth: Month, lastMonth: Month) {

  if (!data) {
    return [];
  }

  const result: Mutation[] = [];

  const addUnbudgetedIncome = data.unbudgetedIncome > 0;
  let rolledUpTotal = 0;

  for (const x of data.rollupCategories) {
    rolledUpTotal += x.remainingAmount;

    const input: WebMoveMoneyMutationInput = {
      amount: x.remainingAmount,
      fromCategoryId: x.id,
      startDate: lastMonth.firstDay.toISOString().slice(0, 10),
      timeframe: TimeFrame[TimeFrame.month],
      toCategoryId: rollupCategoryId
    };

    result.push({ query: WebMoveMoneyMutation, input });
  }

  if (addUnbudgetedIncome) {

    const total = data.rollupTarget.plannedCashFlowAmount! + rolledUpTotal + data.unbudgetedIncome;

    const input: UpdateBudgetItemInput = {
      amount: total,
      categoryId: rollupCategoryId,
      startDate: lastMonth.firstDay.toISOString().slice(0, 10),
      timeframe: TimeFrame[TimeFrame.month],
      applyToFuture: false
    };

    result.push({ query: CommonUpdateBudgetItemMutation, input });
  }

  return result;
}