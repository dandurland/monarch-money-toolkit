import ProgressBar from '@ramonak/react-progress-bar';
import React from 'react';
import { formatCurrency } from 'toolkit/extension/utilities/currency';
import {
  $Widget,
  $WidgetTitle
} from 'toolkit/components/styles/widget-styles.sc';

import { $FlexContainer } from 'toolkit/components/styles/flex-container.sc';
import { useSuspenseQuery } from '@apollo/client';
import { GetAccounts } from 'toolkit/core/graphql/getAccounts';
import { ErrorBoundary } from '@sentry/react';
import { useWidgetSettings } from 'toolkit/extension/hooks/useWidgetSettings';
import styled from 'styled-components';

const $EffectiveBalanceRoot = styled.div`
  padding: ${({ theme }) => `${theme.spacing.default} ${theme.spacing.xlarge}`};
`;

const $Total = styled.span`
  line-height: 150%;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const $TotalAssets = styled($Total)`
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({theme}) => `${theme.color.textLight}`};
`;

export const $ProgressBar = styled.div`
  margin: 12px 0px;
`;
  
export function EffectiveBalance() {

  const settings = useWidgetSettings('EffectiveBalanceFeature');

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
    ? '#19d2a5'
    : progress > .30
      ? '#ffd278'
      : '#f0648c';

  return (
    <$EffectiveBalanceRoot>
      <$Widget id='mmtk-effective-balance'>
        <$WidgetTitle>Effective Balance</$WidgetTitle>
        <ErrorBoundary fallback={<div>Error</div>}>
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
          <$FlexContainer justifyBetween>
            <$Total>
              <span>{formatCurrency(creditTotal)} </span>
              total charges
            </$Total>

            <$TotalAssets>
              <span>{formatCurrency(assetsTotal)} </span>
              total assets
            </$TotalAssets>
          </$FlexContainer>
        </ErrorBoundary>
      </$Widget>
    </$EffectiveBalanceRoot>
  );
}