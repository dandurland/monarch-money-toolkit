import $ from 'jquery';
import { Suspense, useRef } from 'react';
import { useMutationObserver } from '@extension/shared';
import { formatCurrency, getCurrentMonth } from '@extension/shared';
import { useSuspenseGetJointPlanningData } from '@extension/monarch';
import { OverBudgetCalculator } from './over-budget-calculator';
import { Spinner } from '@extension/ui';
import { ErrorBoundary } from '@sentry/react';
import { Virtuoso } from 'react-virtuoso';
import { ArrowRight } from 'lucide-react';

const CategoryAmount = ({ amount }: { amount: number }) => {
  return (
    <div
      className={`w-1/5 text-ellipsis whitespace-nowrap overflow-hidden text-center ${amount < 0 ? 'text-red-500' : ''}`}>
      {formatCurrency(amount ?? 0)}
    </div>
  );
};

const OverBudgetRow = ({ item }: { item: any }) => {
  return (
    <div className="flex flex-row justify-between items-center overflow-x-hidden border-t-[1px] border-t-background w-full">
      <div className="flex flex-row justify-between items-center w-full py-[14px] px-[24px]">
        <div className="w-2/5 text-ellipsis whitespace-nowrap overflow-hidden text-left">{item.name}</div>
        <CategoryAmount amount={item.plannedCashFlowAmount ?? 0} />
        <CategoryAmount amount={item.actualAmount} />

        <CategoryAmount amount={item.remainingAmount} />
      </div>
    </div>
  );
};

const OverBudgetHeader = () => {
  return (
    <div className="flex flex-row flex-nowrap justify-between">
      <div className="flex flex-row justify-end items-center w-full py-[14px] px-[24px]">
        <div className="w-1/5 text-ellipsis whitespace-nowrap overflow-hidden text-center font-medium">Budget</div>
        <div className="w-1/5 text-ellipsis whitespace-nowrap overflow-hidden text-center font-medium">Actual</div>
        <div className="w-1/5 text-ellipsis whitespace-nowrap overflow-hidden text-center font-medium">Remaining</div>
      </div>
    </div>
  );
};

const OverBudget = () => {
  const currentMonth = getCurrentMonth();
  const { data, refetch } = useSuspenseGetJointPlanningData(currentMonth.firstDay, currentMonth.lastDay);
  const calculator = new OverBudgetCalculator();
  const overBudgetCategories = calculator.getOverBudgetData(data, true);
  const categories = overBudgetCategories?.catagories ?? [];

  const ref = useRef($('[class^="TransactionCategorySelect__Root"] [class^="Text"]').toArray());
  useMutationObserver(ref, refetch, {
    config: { attributes: false, childList: true, subtree: true, characterData: true },
    debounceTime: 0,
  });

  return (
    <div className="flex flex-col justify-start">
      <OverBudgetHeader />
      <Virtuoso
        style={{ height: Math.min(categories.length * 56, 240) }}
        data={categories}
        itemContent={(_, item) => <OverBudgetRow item={item} />}></Virtuoso>
    </div>
  );
};

export function OverBudgetWidget() {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <div id="mmtk-over-budget" className="flex flex-col place-content-stretch rounded-lg">
        <a href="/budget" className="group pt-5 pr-5 pb-4 pl-6 text-gray-400">
          <div className="flex flex-row items-center text-xs font-semibold uppercase tracking-[1.2px] bottom-3 group-hover:text-lightBlue">
            Over Budget Categories
            <span className="group-hover:opacity-100 group-hover:transform-none w-4 h-4 ml-1 opacity-0 -translate-x-3 ease-out duration-100">
              <ArrowRight className="text-current size-4 stroke-2" />
            </span>
          </div>
        </a>
        <Suspense
          fallback={
            <div className="flex flex-row justify-center m-6">
              <Spinner />
            </div>
          }>
          <OverBudget />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
