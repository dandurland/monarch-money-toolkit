import { getMonarchDateString, Month } from "toolkit/extension/utilities/date";
import { JointPlanningData, CategoryGroupType } from "../monarch-money-api/model";

export interface BudgetRollupCategoryData {
  id: string;
  plannedCashFlowAmount?: number;
  remainingAmount: number;
}

export interface BudgetRollupData {
  canRollup: boolean;
  unbudgetedIncome: number;
  rollupTarget: BudgetRollupCategoryData;
  rollupCategories: BudgetRollupCategoryData[];
}


export class BudgetRollupCalculator {

  getBudgetRollupData(data: JointPlanningData, rollupCategoryId: string, includeOverspentCategories: boolean, currentMonth: Month, lastMonth: Month) : BudgetRollupData | null {

    if (!data) {
      return null;
    }
  
    let month = getMonarchDateString(currentMonth.firstDay);
    const targetCategory = data.budgetData.monthlyAmountsByCategory
      .find(x => x.category.id === rollupCategoryId)
      ?.monthlyAmounts.find(x => x.month === month);
  
    if (targetCategory === undefined) {
      console.log('No rollup category configured');
      throw Error('No rollup category configured');
    }
  
    const targetCategoryData: BudgetRollupCategoryData = {
      id: rollupCategoryId,
      plannedCashFlowAmount: targetCategory.plannedCashFlowAmount,
      remainingAmount: targetCategory.remainingAmount,
    };
  
    const categoryBlacklist = data.categoryGroups
      .filter((x) => x.type === CategoryGroupType.transfer || x.type === CategoryGroupType.income)
      .map((x) => x.categories?.map((c) => c.id))
      .flat();
  
    month = getMonarchDateString(lastMonth.firstDay);
  
    const lastMonthTotals = data.budgetData.totalsByMonth
      .find(x => x.month === month)!;
  
    const remaining = lastMonthTotals.totalIncome.plannedAmount - lastMonthTotals.totalExpenses.plannedAmount;
  
    const ltc = data.budgetData.monthlyAmountsByCategory
      .find(x => x.category.id === rollupCategoryId)
      ?.monthlyAmounts.find(x => x.month === month);
  
    targetCategoryData.plannedCashFlowAmount = ltc?.plannedCashFlowAmount;
  
    const rollupCategories: BudgetRollupCategoryData[] = [];
    for (const x of data.budgetData.monthlyAmountsByCategory) {
  
      if (categoryBlacklist.includes(x.category.id)) {
        continue;
      }
  
      const monthlyAmounts = x.monthlyAmounts.find(m => m.month === month);
      if (monthlyAmounts
        && monthlyAmounts.rolloverType === null
        && ((includeOverspentCategories === true && monthlyAmounts.remainingAmount !== 0) || monthlyAmounts.remainingAmount > 0)) {
        rollupCategories.push({
          id: x.category.id,
          remainingAmount: monthlyAmounts.remainingAmount,
        });
      }
    }
  
    const result: BudgetRollupData = {
      canRollup: remaining > 0 || rollupCategories.length > 0,
      unbudgetedIncome: remaining,
      rollupTarget: targetCategoryData,
      rollupCategories: rollupCategories
    };
  
    return result;
  }
}