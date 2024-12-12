import { getCurrentMonth, useTransactionMutationEvent } from '@extension/shared';
import { useGetJointPlanningData } from '@extension/monarch';
import { OverBudgetCalculator } from './over-budget-calculator';
import { useEffect, useMemo } from 'react';

export function OverBudgetCount() {
  const currentMonth = getCurrentMonth();

  const response = useTransactionMutationEvent();
  const { data, error, refetch } = useGetJointPlanningData(
    currentMonth.firstDay,
    currentMonth.lastDay,
    'cache-and-network',
  );

  useEffect(() => {
    refetch();
  }, [response]);

  const count = useMemo(() => {
    const calculator = new OverBudgetCalculator();
    return calculator.getOverBudgetCount(data, true);
  }, [data]);

  if (error || count === 0) {
    return <></>;
  }

  return (
    <span className="ml-auto inline-block rounded-sm bg-information px-2 text-[10px] font-semibold uppercase decoration-blue">
      {count}
    </span>
  );
}
