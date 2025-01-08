import { useCallback, useMemo, useState } from 'react';
import { formatCurrency, useStorage } from '@extension/shared';
import { useSuspenseGetAccounts } from '@extension/monarch';
import type { EffectiveBalanceData } from './effective-balance-calculator';
import { EffectiveBalanceCalculator } from './effective-balance-calculator';
import { DashboardWidget } from '@extension/ui';
import { featureStorage } from '../feature-storage';

interface Width {
  width: string;
}

interface ProgressSegment {
  color: string;
  width: Width;
}

interface Balance {
  color: string;
  value: number;
}

interface State extends EffectiveBalanceData {
  depositoryColor?: string;
  progress?: Record<string, ProgressSegment>;
}

const EffectiveBalance = ({ setBalance }: { setBalance: (balance: Balance) => void }) => {
  const { depositoryAccountIds, creditAccountIds } = useStorage(featureStorage);
  const { data } = useSuspenseGetAccounts();
  const [state, setState] = useState<State>({ creditTotal: 0, depositoryTotal: 0 });

  useMemo(() => {
    const calculator = new EffectiveBalanceCalculator();
    const { creditTotal, depositoryTotal } = calculator.getEffectiveBalance(
      data,
      depositoryAccountIds.concat(creditAccountIds),
    ) ?? {
      creditTotal: 0,
      depositoryTotal: 0,
    };

    const percentRemaining =
      depositoryTotal <= 0 ? 0 : Math.round(((depositoryTotal - creditTotal) / depositoryTotal) * 100);
    const green = percentRemaining > 0 ? percentRemaining : 0;
    const yellow = green > 0 ? 100 - green : 0;
    const red = green <= 0 ? 100 : 0;
    const progress: Record<string, ProgressSegment> = {
      green: {
        color: 'bg-green',
        width: { width: `${green}%` },
      },
      yellow: {
        color: 'bg-yellow',
        width: { width: `${yellow}%` },
      },
      red: {
        color: 'bg-warning',
        width: { width: `${red}%` },
      },
    };

    const depositoryColor =
      percentRemaining < 25 ? 'text-warning' : percentRemaining < 50 ? 'text-yellow' : 'text-textGreen';
    setState({
      creditTotal: creditTotal,
      depositoryTotal: depositoryTotal,
      depositoryColor,
      progress,
    });

    setBalance({
      color: depositoryColor,
      value: depositoryTotal - creditTotal,
    });
  }, [data, depositoryAccountIds, creditAccountIds]);

  return (
    <div className="flex flex-col place-content-start gap-2 pb-4 pl-6 pr-5 pt-5">
      <div className="mb-4 flex h-2 gap-px overflow-hidden rounded bg-gray-100 text-xs">
        <div
          style={state.progress?.green?.width}
          className={`${state.progress?.green.color} transition-all duration-500 ease-out`}></div>
        <div
          style={state.progress?.yellow?.width}
          className={`${state.progress?.yellow.color} transition-all duration-500 ease-out`}></div>
        <div
          style={state.progress?.red?.width}
          className={`${state.progress?.red.color} transition-all duration-500 ease-out`}></div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="text-sm font-medium">
          <span>{formatCurrency(state.creditTotal)} </span>
          total charges
        </div>
        <div className="text-sm font-medium">
          <span className={state.depositoryColor}>{formatCurrency(state.depositoryTotal)} </span>
          <span className="text-widget-foreground-secondary">remaining</span>
        </div>
      </div>
    </div>
  );
};

export function EffectiveBalanceWidget({ name }: { name: string }) {
  const { enabled } = useStorage(featureStorage);
  const [state, setState] = useState<{ name: string; description: string }>({ name, description: '' });

  const handleBalanceChange = useCallback((balance: Balance) => {
    setState({ name: formatCurrency(balance.value), description: name.toLowerCase() });
  }, []);

  return (
    <>
      {enabled ? (
        <DashboardWidget
          id="mmtk-effective-balance"
          title={state.name}
          description={state.description}
          link="/accounts"
          useSuspense>
          <EffectiveBalance setBalance={handleBalanceChange} />
        </DashboardWidget>
      ) : (
        <></>
      )}
    </>
  );
}
