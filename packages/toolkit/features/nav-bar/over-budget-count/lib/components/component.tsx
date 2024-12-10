import { getCurrentMonth, ErrorBoundary } from '@extension/shared';
import { useGetJointPlanningData } from '@extension/monarch';
import { OverBudgetCalculator } from './over-budget-calculator';

export function OverBudgetCount() {
  const currentMonth = getCurrentMonth();
  const { data, loading, error } = useGetJointPlanningData(currentMonth.firstDay, currentMonth.lastDay);
  if (loading || error) {
    return <></>;
  }
  const calculator = new OverBudgetCalculator();
  const count = calculator.getOverBudgetCount(data!, true);

  return (
    <ErrorBoundary fallback={<div />}>
      <span className="ml-auto inline-block rounded-sm bg-information px-2 text-[10px] font-semibold uppercase decoration-blue">
        {count}
      </span>
    </ErrorBoundary>
  );
}
