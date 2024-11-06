import ProgressBar from '@ramonak/react-progress-bar';
import React from 'react';
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

export function EffectiveBalance({ settings }: { settings: any }) {

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

  return (
    <div>
      <ErrorBoundary fallback={<div>Error</div>}>
        <$Widget id='mmtk-effective-balance' $isDark={isDark}>
          <$WidgetTitle>Effective Balance</$WidgetTitle>
          <$ProgressBar>
            <ProgressBar
              borderRadius='4px'
              height='8px'
              bgColor='#19d2a5'
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