import $ from 'jquery';
import React, { Suspense, useRef} from 'react';
import styled from 'styled-components';
import { formatCurrency } from 'toolkit/extension/utilities/currency';
import {
  $ClickableWidgetHeader,
  $Widget,
  $WidgetLinkArrow,
  $WidgetTitle
} from 'toolkit/components/styles/widget-styles.sc';
import { $FlexContainer } from 'toolkit/components/styles/flex-container.sc';
import { ErrorBoundary } from '@sentry/react';
import { getCurrentMonth } from 'toolkit/extension/utilities/date';
import { OverBudgetCalculator } from 'toolkit/core/calculators/overBudgetCalculator';
import { useSuspenseGetJointPlanningData } from 'toolkit/core/graphql/getJointPlanningData';
import { Virtuoso } from 'react-virtuoso';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'toolkit/components/spinner/component';
import { useMutationObserver } from 'toolkit/common/lib/hooks/use-mutation-observer';

const $OverBudgetRowContainer = styled($FlexContainer).attrs({ justifyBetween: true, alignCenter: true })`
  overflow-x: hidden;
  border-top: 1px solid ${({ theme }) => theme.color.grayBackground};
  width: 100%;
`;

const $OverBudgetHeaderRoot = styled($FlexContainer).attrs({ justifyEnd: true, alignCenter: true })`
    padding: ${({ theme }) => theme.spacing.xxxsmall} ${({ theme }) => theme.spacing.xlarge};
    width: 100%;
`;

const $BudgetRow = styled($FlexContainer).attrs({ justifyBetween: true, alignCenter: true })`
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.xlarge};
  width: 100%;
`;

const $CategoryName = styled.div`
  width: 40%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
`;

const $CategoryHeader = styled.div`
  width: 20%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  font-size: ${({theme}) => `${theme.fontSize.base}`};
  font-weight: 500;
  color: ${({theme}) => `${theme.color.textLight}`};
  transition: ${({ theme }) => theme.transition.default};
`;

const $CategoryAmount = styled.div<{$negitive: boolean}>`
  width: 20%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  color: ${({ $negitive, theme }) => $negitive ? theme.color.red : theme.color.text};
`;

const $ContainerRoot = styled($FlexContainer).attrs({ column: true, justifyStart: true })`
  border-bottom: ${({ theme }) => theme.color.grayBackground};
`;

const CategoryAmount = ({amount} : {amount: number}) => {
  return (
    <$CategoryAmount $negitive={amount < 0}>{formatCurrency(amount ?? 0)}</$CategoryAmount>
  );
};

const OverBudgetRow = ({item} : { item: any}) => {
  return (
    <$OverBudgetRowContainer>
      <$BudgetRow>
        <$CategoryName>{item.name}</$CategoryName>
        <CategoryAmount amount={item.plannedCashFlowAmount ?? 0} />
        <CategoryAmount amount={item.actualAmount} />
        <CategoryAmount amount={item.remainingAmount} />
      </$BudgetRow>
    </$OverBudgetRowContainer>
  );
}

const OverBudgetHeader = () => {

  return (
    <$FlexContainer justifyBetween>
      <$OverBudgetHeaderRoot>
        <$CategoryHeader>Budget</$CategoryHeader>
        <$CategoryHeader>Actual</$CategoryHeader>
        <$CategoryHeader>Remaining</$CategoryHeader>
      </$OverBudgetHeaderRoot>
    </$FlexContainer>
)};

const OverBudget = () => {

  const currentMonth = getCurrentMonth();
  const {data, refetch} = useSuspenseGetJointPlanningData(currentMonth.firstDay, currentMonth.lastDay);
  const calculator = new OverBudgetCalculator();
  const overBudgetCategories = calculator.getOverBudgetData(data, true);
  const categories = overBudgetCategories?.catagories ?? [];

  const ref = useRef($('[class^="TransactionCategorySelect__Root"] [class^="Text"]').toArray()); 
  useMutationObserver(ref, refetch, { config : { attributes: false, childList: true, subtree: true, characterData : true}, debounceTime: 0});

  return (
    <$ContainerRoot>
      <OverBudgetHeader />
      <Virtuoso
        style={{ height: Math.min(categories.length * 56, 240) }}
        data={categories}
        itemContent={(_, item) => (
          <OverBudgetRow item={item} />
        )}>
        </Virtuoso>
    </$ContainerRoot>
  );
}

export function OverBudgetWidget() {

  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <$Widget id='mmtk-over-budget'>
        <$ClickableWidgetHeader href='/budget'>
          <$WidgetTitle>
            Over Budget Categories
            <$WidgetLinkArrow><FontAwesomeIcon icon={['fas', 'arrow-right']} /></$WidgetLinkArrow>
          </$WidgetTitle>
        </$ClickableWidgetHeader>
        <Suspense fallback={<Spinner />}>
          <OverBudget/>
        </Suspense>
      </$Widget>
    </ErrorBoundary>
  );
}