import type { JointPlanningData } from '@extension/monarch';
import { CategoryGroupType } from '@extension/monarch';

export interface OverBudgetCategory {
  id: string;
  icon: string;
  name: string;
  plannedCashFlowAmount?: number;
  actualAmount: number;
  remainingAmount: number;
}

export interface OverBudgetData {
  catagories: OverBudgetCategory[];
}

export class OverBudgetCalculator {
  getOverBudgetData(data: JointPlanningData, round: boolean): OverBudgetData | null {
    if (!data) {
      return null;
    }

    const categoryBlacklist = data.categoryGroups
      .filter(x => x.type === CategoryGroupType.transfer || x.type === CategoryGroupType.income)
      .map(x => x.categories?.map(c => c.id))
      .flat();

    const lessThan = round ? -0.49 : 0;
    const catagories = data.budgetData.monthlyAmountsByCategory
      .filter(x => !categoryBlacklist.includes(x.category.id) && x.monthlyAmounts[0].remainingAmount < lessThan)
      .map(x => {
        return {
          id: x.category.id,
          icon: x.category.icon,
          name: x.category.name,
          plannedCashFlowAmount: round
            ? Math.round(x.monthlyAmounts[0].plannedCashFlowAmount)
            : x.monthlyAmounts[0].plannedCashFlowAmount,
          actualAmount: round ? Math.round(x.monthlyAmounts[0].actualAmount) : x.monthlyAmounts[0].actualAmount,
          remainingAmount: round
            ? Math.round(x.monthlyAmounts[0].remainingAmount)
            : x.monthlyAmounts[0].remainingAmount,
        };
      })
      .sort((x, y) => x.remainingAmount - y.remainingAmount);

    return { catagories };
  }
}
