import { getCurrentMonth, ErrorBoundary } from '@extension/shared';
import { useGetJointPlanningData } from '@extension/monarch';
import { OverBudgetCalculator } from './over-budget-calculator';

export function OverBudgetCount() {
  const currentMonth = getCurrentMonth();
  const { data, loading, error } = useGetJointPlanningData(currentMonth.firstDay, currentMonth.lastDay);
  if (loading) {
    return <></>;
  }
  const calculator = new OverBudgetCalculator();
  const count = calculator.getOverBudgetCount(data!, true);

  return (
    <ErrorBoundary fallback={<div />}>
      <span className="inline-block ml-auto pl-2 pr-2 font-semibold text-[10px] uppercase bg-information decoration-blue rounded-sm">
        {count}
      </span>
    </ErrorBoundary>
  );
}
