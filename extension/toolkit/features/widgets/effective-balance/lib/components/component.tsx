import { Suspense, useMemo, useState } from 'react';
import { ErrorBoundary, formatCurrency, useStorage } from '@extension/shared';
import { useSuspenseGetAccounts } from '@extension/monarch';
import { EffectiveBalanceCalculator, EffectiveBalanceData } from './effective-balance-calculator';
import { Progress, Spinner } from '@extension/ui';
import { featureStorage } from '../feature-storage';
import { getEnglishMonthName } from '@extension/core';

const getColor = (value: number) => {
  const hue = value < 0 || value > 100 ? '0' : ((1 - value * 0.1) * 120).toString(10);

  return ['bg-[color:hsl(', hue, ',55%,42%)]'].join('');
};
//className={`bg-grayFocus h-2 [&>*]:${getColor(1 - (state.creditTotal / state.depositoryTotal))}`}

//className="bg-grayFocus h-2 [&>*]:bg-red-500"
/*{
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
}*/

//indicatorClassName="w-1/2 bg-gradient-to-r from-go from-30% to-warning to-90%"

const EffectiveBalance = () => {
  const { data, refetch } = useSuspenseGetAccounts();

  const [state, setState] = useState<EffectiveBalanceData>({ creditTotal: 0, depositoryTotal: 0 });

  useMemo(() => {
    const calculator = new EffectiveBalanceCalculator();
    const effectiveBalance = calculator.getEffectiveBalance(data, []);
    setState({ creditTotal: 100, depositoryTotal: 200 });
    //setState(effectiveBalance ?? { creditTotal: 0, depositoryTotal: 0 });

    //return { creditTotal: 100, depositoryTotal: 200, progress: 1 - (100/200) };
    //return effectiveBalance ?? { creditTotal: 0, depositoryTotal: 0 };
  }, [data]);

  return (
    <div className="flex flex-col place-content-start pb-4 pl-6 pr-5 pt-5 gap-2">
      <Progress
        className="bg-grayFocus h-2"
        indicatorClassName="bg-gradient-to-r from-green-900 from-70% via-red-500 via-15% to-grayFocus to-100%"
        value={(state.creditTotal / state.depositoryTotal) * 100}
      />
      <div className="flex flex-row justify-between">
        <div className="text-sm font-medium">
          <span>{formatCurrency(state.creditTotal)} </span>
          total charges
        </div>
        <div className="text-sm font-medium">
          <span className={state.depositoryTotal > 0 ? 'text-textGreen' : 'text-warning'}>
            {formatCurrency(state.depositoryTotal)}{' '}
          </span>
          <span className="text-widget-foreground-secondary">remaining</span>
        </div>
      </div>
    </div>
  );
};

export function EffectiveBalanceWidget() {
  const { enabled } = useStorage(featureStorage);
  const month = useMemo(() => {
    const date = new Date();
    return `${getEnglishMonthName(date.getMonth())} ${date.getFullYear()}`;
  }, []);

  return (
    <>
      {enabled ? (
        <ErrorBoundary fallback={<div>Error retrieving effective balance data</div>}>
          <div
            id="mmtk-effective-balance"
            className="flex flex-col place-content-stretch rounded-lg text-widget-foreground">
            <a href="/budget" className="group pb-4 pl-6 pr-5 pt-5 text-inherit">
              <div className="bottom-3 flex flex-row items-center gap-2 text-lg font-semibold group-hover:text-lightBlue">
                <span>Effective Balance</span>
                <span className="text-base text-widget-foreground-secondary">{month}</span>
              </div>
            </a>
            <Suspense
              fallback={
                <div className="m-6 flex flex-row justify-center">
                  <Spinner />
                </div>
              }>
              <EffectiveBalance />
            </Suspense>
          </div>
        </ErrorBoundary>
      ) : (
        <></>
      )}
    </>
  );
}
