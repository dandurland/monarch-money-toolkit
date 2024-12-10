import type { JointPlanningData } from '@extension/monarch';
import { CategoryGroupType } from '@extension/monarch';

export class OverBudgetCalculator {
  getOverBudgetCount(data: JointPlanningData, round: boolean): number {
    if (!data) {
      return 0;
    }

    const categoryBlacklist = data.categoryGroups
      .filter(x => x.type === CategoryGroupType.transfer || x.type === CategoryGroupType.income)
      .map(x => x.categories?.map(c => c.id))
      .flat();

    const lessThan = round ? -0.49 : 0;
    const count = data.budgetData.monthlyAmountsByCategory.filter(
      x => !categoryBlacklist.includes(x.category.id) && x.monthlyAmounts[0].remainingAmount < lessThan,
    ).length;

    return count;
  }
}
