import ProgressBar from '@ramonak/react-progress-bar';
import React, { useContext, useEffect, useSyncExternalStore } from 'react';
import { formatCurrency } from 'toolkit/extension/utilities/currency';
import {
  $FlexContainerRoot,
  $ProgressBar,
  $TotalAssets,
  $TotalCharges,
  $Widget,
  $WidgetTitle
} from 'toolkit/components/styles/widget-styles.sc';
import { useSuspenseQuery } from '@apollo/client';
import { GetAccounts } from 'toolkit/core/graphql/getAccounts';
import { ErrorBoundary } from '@sentry/react';
import { uid } from 'uid';
import { useWidgetSettings } from 'toolkit/extension/hooks/useWidgetSettings';

export function EffectiveBalance() {

  const settings = useWidgetSettings('EffectiveBalanceFeature');

  const key = uid();
  const isDark = settings?.theme === 'dark';
  const accountData = useSuspenseQuery(GetAccounts, {
    fetchPolicy: "no-cache",
  });

  let assetsTotal = 0;
  let creditTotal = 0;

  accountData.data?.accounts?.forEach((account) => {
    if (settings?.assetAccountIds.includes(account.id)) {
      assetsTotal += account.currentBalance;
    } else if (settings?.creditAccountIds.includes(account.id)) {
      creditTotal += -(account.currentBalance);
    }
  });

  const progress = 1 - (creditTotal / assetsTotal);
  const progressColor = progress > .60 
    ? 'rgb(25, 210, 165)'
    : progress > .30
      ? 'rgb(255, 210, 120)'
      : 'rgb(240, 100, 140)';

  return (
    <div>
      <ErrorBoundary fallback={<div>Error</div>}>
        <$Widget id='mmtk-effective-balance' $isDark={isDark}>
          <$WidgetTitle>Effective Balance</$WidgetTitle>
          <$ProgressBar>
            <ProgressBar
              borderRadius='4px'
              height='8px'
              bgColor={progressColor}
              isLabelVisible={false}
              completed={progress}
              maxCompleted={1}
            />
          </$ProgressBar>
          <$FlexContainerRoot>
            <$TotalCharges>
              <span>{formatCurrency(creditTotal)} </span>
              total charges
            </$TotalCharges>

            <$TotalAssets>
              <span>{formatCurrency(assetsTotal)} </span>
              total assets
            </$TotalAssets>
          </$FlexContainerRoot>
        </$Widget>
      </ErrorBoundary>
    </div>
  );
}