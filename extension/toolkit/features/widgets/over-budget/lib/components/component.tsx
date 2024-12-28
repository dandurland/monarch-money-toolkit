import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ErrorBoundary,
  formatCurrency,
  getCurrentMonth,
  useStorage,
  useTransactionMutationEvent,
} from '@extension/shared';
import { useSuspenseGetJointPlanningData } from '@extension/monarch';
import type { OverBudgetCategory } from './over-budget-calculator';
import { OverBudgetCalculator } from './over-budget-calculator';
import { Spinner } from '@extension/ui';
import { Virtuoso } from 'react-virtuoso';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { featureStorage } from '../feature-storage';
import { getEnglishMonthName } from '@extension/core';

const CategoryAmount = ({ amount }: { amount: number }) => {
  return (
    <div className={`w-1/5 truncate text-center ${amount < 0 ? 'text-red-500' : ''}`}>
      {formatCurrency(amount ?? 0)}
    </div>
  );
};

const AllClearRow = () => {
  return (
    <div className="flex w-full flex-row items-center justify-center overflow-x-hidden border-t border-t-background px-[24px] py-[14px]">
      No over budget categories
    </div>
  );
};

const OverBudgetRow = ({ item }: { item: OverBudgetCategory }) => {
  return (
    <div className="flex w-full flex-row items-center justify-between overflow-x-hidden border-t border-t-background">
      <div className="flex w-full flex-row items-center justify-between px-[24px] py-[14px]">
        <div className="w-2/5 truncate text-left">
          <span className="mr-1">{item.icon}</span>
          <span>{item.name}</span>
        </div>
        <CategoryAmount amount={item.plannedCashFlowAmount ?? 0} />
        <CategoryAmount amount={item.actualAmount} />
        <CategoryAmount amount={item.remainingAmount} />
      </div>
    </div>
  );
};

const OverBudgetHeader = ({ canSort, onSort }: { canSort: boolean; onSort: (sortAsc: boolean) => void }) => {
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = () => {
    setSortAsc(!sortAsc);
    onSort(!sortAsc);
  };

  return (
    <div className="flex flex-row flex-nowrap justify-between">
      <div className="flex w-full flex-row items-center justify-end px-[24px] py-[14px]">
        <div className="w-1/5 truncate text-center font-medium">Budget</div>
        <div className="w-1/5 truncate text-center font-medium">Actual</div>
        <div className={`w-1/5 truncate text-center font-medium ${canSort ? 'flex flex-row justify-end' : ''}`}>
          {canSort ? (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div className="flex cursor-pointer flex-row items-center" onClick={toggleSort} onKeyDown={toggleSort}>
              <span>Remaining</span>
              <span>
                {sortAsc ? <ArrowUpNarrowWide className="size-4" /> : <ArrowDownNarrowWide className="size-4" />}
              </span>
            </div>
          ) : (
            <span>Remaining</span>
          )}
        </div>
      </div>
    </div>
  );
};

const OverBudget = () => {
  const currentMonth = getCurrentMonth();
  const response = useTransactionMutationEvent(request => {
    return request.variables.categoryId !== undefined;
  });

  const { data, refetch } = useSuspenseGetJointPlanningData(
    currentMonth.firstDay,
    currentMonth.lastDay,
    'cache-and-network',
  );

  useEffect(() => {
    refetch();
  }, [response]);

  const [sortAsc, setSortAsc] = useState(false);

  const categories = useMemo(() => {
    const calculator = new OverBudgetCalculator();
    const overBudgetCategories = calculator.getOverBudgetData(data, sortAsc, true);
    return overBudgetCategories?.catagories ?? [];
  }, [data, sortAsc]);

  const sortCallback = useCallback((sortAsc: boolean) => setSortAsc(sortAsc), []);

  return (
    <div className="flex flex-col justify-start">
      <OverBudgetHeader canSort={categories?.length > 1} onSort={sortCallback} />
      {categories.length === 0 ? (
        <AllClearRow />
      ) : (
        <Virtuoso
          style={{ height: Math.min(categories.length * 56, 220) }}
          data={categories}
          itemContent={(_, item) =>
            categories?.length === 0 ? <AllClearRow /> : <OverBudgetRow item={item} />
          }></Virtuoso>
      )}
    </div>
  );
};

export function OverBudgetWidget({ name }: { name: string }) {
  const { enabled } = useStorage(featureStorage);
  const month = useMemo(() => {
    const date = new Date();
    return `${getEnglishMonthName(date.getMonth())} ${date.getFullYear()}`;
  }, []);

  return (
    <>
      {enabled ? (
        <ErrorBoundary fallback={<div>Error retrieving over budget data</div>}>
          <div id="mmtk-over-budget" className="flex flex-col place-content-stretch rounded-lg text-widget-foreground">
            <a href="/budget" className="group pb-4 pl-6 pr-5 pt-5 text-inherit">
              <div className="bottom-3 flex flex-row items-center gap-2 text-lg font-semibold group-hover:text-lightBlue">
                <span>{name}</span>
                <span className="text-base text-widget-foreground-secondary">{month}</span>
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
      ) : (
        <></>
      )}
    </>
  );
}
