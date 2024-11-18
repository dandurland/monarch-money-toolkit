import React, { useEffect, useState } from 'react';
import { formatCurrency } from 'toolkit/extension/utilities/currency';
import { getCurrentMonth, getLastMonth } from 'toolkit/extension/utilities/date';
import {
  $Widget,
  $WidgetTitle,
} from 'toolkit/components/styles/widget-styles.sc';
import { $FlexContainer } from 'toolkit/components/styles/flex-container.sc';

import { $FlatGhostButton } from 'toolkit/components/styles/buttons.sc';
import { useGetJointPlanningData } from 'toolkit/core/graphql/getJointPlanningData';
import { ErrorBoundary } from '@sentry/react';
import { ThemePreference } from 'toolkit/core/utilities/monarchSettings';
import Spinner from 'toolkit/components/spinner/component';
import SideDrawer from 'toolkit/components/side-drawer/component';
import { BudgetRollupCalculator } from 'toolkit/core/calculators/budgetRollupCalculator';
import { RollupComponent, RollupData } from './rollup';
import { useWidgetSettings } from 'toolkit/extension/hooks/useWidgetSettings';
import styled from 'styled-components';

const $ReadyToAsssignRoot = styled.div`
  padding: ${({ theme }) => `${theme.spacing.default} ${theme.spacing.xlarge}`};
`;

const $Total = styled.span`
  font-style: normal;
  text-align: inherit;
  line-height: 150%;
  text-transform: none;
  font-weight: 500;
`;

const $TotalCharges = styled($Total)`
  font-size: inherit;
  color: inherit;
`;

interface State {
  canRollup: boolean,
  rollupAmount: number
};

export function ReadyToAssignComponent() {

  const settings = useWidgetSettings('ReadyToAssignFeature');

  const [state, setState] = useState<State>({
    canRollup: false,
    rollupAmount: 0,
  });

  const [isRollupOpen, setIsRollupOpen] = useState(false);

  const currentMonth = getCurrentMonth();
  const lastMonth = getLastMonth();
 
  const { loading, error, data, refetch } = useGetJointPlanningData(lastMonth.firstDay, currentMonth.lastDay);

  const budgetRollupCalculator = new BudgetRollupCalculator();
  const budgetData = budgetRollupCalculator.getBudgetRollupData(data!, settings?.rollupCategoryId, settings?.includeOverspentCategories, currentMonth, lastMonth);

  const rollupData: RollupData = {
    budgetData: budgetData,
    rollupCategoryId: settings?.rollupCategoryId,
    currentMonth: currentMonth,
    lastMonth: lastMonth
  }

  useEffect(() => {

    if(budgetData == null){
      return;
    }
    
    const canRollup = budgetData.unbudgetedIncome > 0
      || budgetData.rollupCategories.length > 0;

    const s: State = {
      canRollup: canRollup,
      rollupAmount: budgetData.rollupTarget.remainingAmount
    };

    setState(s);
    
  }, [data]);


  const onRollupClicked = () => {
    setIsRollupOpen(!isRollupOpen);
  }

  const onRollupClosed = async () => {
    setIsRollupOpen(false);
  }

  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      {!loading ? (
        <$ReadyToAsssignRoot>
          <$Widget id='mmtk-ready-to-assign'>
            <$WidgetTitle>Ready To Assign</$WidgetTitle>
            <$FlexContainer justifyBetween>
              <$TotalCharges>{formatCurrency(state.rollupAmount)}</$TotalCharges>
              {state.canRollup && (
                <$FlatGhostButton onClick={() => onRollupClicked()}>Rollup Last Month</$FlatGhostButton>
              )}
            </$FlexContainer>
            <SideDrawer
              isOpen={isRollupOpen}
              onClose={() => onRollupClosed()}
              removeWhenClosed={true}>
              <button type="button" onClick={() => setIsRollupOpen(false)}>
                Close
              </button>
              <RollupComponent data={rollupData} />
            </SideDrawer>
          </$Widget>
        </$ReadyToAsssignRoot>
      ) : (<Spinner />)
      }
    </ErrorBoundary>
  );
}