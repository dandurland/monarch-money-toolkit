import $ from 'jquery';
import { Suspense, useRef } from 'react';
import { useMutationObserver, formatCurrency, getCurrentMonth } from '@extension/shared';
import { useSuspenseGetJointPlanningData } from '@extension/monarch';
import { OverBudgetCalculator, OverBudgetCategory } from './over-budget-calculator';
import { Spinner } from '@extension/ui';
import { ErrorBoundary } from '@sentry/react';
import { Virtuoso } from 'react-virtuoso';
import { ArrowRight } from 'lucide-react';

const CategoryAmount = ({ amount }: { amount: number }) => {
  return (
    <div className={`w-1/5 truncate text-center ${amount < 0 ? 'text-red-500' : ''}`}>
      {formatCurrency(amount ?? 0)}
    </div>
  );
};

const OverBudgetRow = ({ item }: { item: OverBudgetCategory }) => {
  return (
    <div className="flex w-full flex-row items-center justify-between overflow-x-hidden border-t border-t-background">
      <div className="flex w-full flex-row items-center justify-between px-[24px] py-[14px]">
        <div className="w-2/5 truncate text-left">{item.name}</div>
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
      <div className="flex w-full flex-row items-center justify-end px-[24px] py-[14px]">
        <div className="w-1/5 truncate text-center font-medium">Budget</div>
        <div className="w-1/5 truncate text-center font-medium">Actual</div>
        <div className="w-1/5 truncate text-center font-medium">Remaining</div>
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
        <a href="/budget" className="group pb-4 pl-6 pr-5 pt-5 text-gray-400">
          <div className="bottom-3 flex flex-row items-center text-xs font-semibold uppercase tracking-[1.2px] group-hover:text-lightBlue">
            Over Budget Categories
            <span className="ml-1 size-4 -translate-x-3 opacity-0 duration-100 ease-out group-hover:transform-none group-hover:opacity-100">
              <ArrowRight className="size-4 stroke-2 text-current" />
            </span>
          </div>
        </a>
        <Suspense
          fallback={
            <div className="m-6 flex flex-row justify-center">
              <Spinner />
            </div>
          }>
          <OverBudget />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
