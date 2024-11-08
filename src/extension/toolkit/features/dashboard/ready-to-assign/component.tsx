import React, { useEffect, useState } from 'react';
import { formatCurrency } from 'toolkit/extension/utilities/currency';
import { Month, getCurrentMonth, getLastMonth, getMonarchDateString } from 'toolkit/extension/utilities/date';
import {
  $Widget,
  $WidgetTitle,
  $TotalCharges,
  $FlexContainerRoot,
} from 'toolkit/components/styles/widget-styles.sc';

import { $FlatButton } from 'toolkit/components/styles/buttons.sc';
import { useGetJointPlanningData } from 'toolkit/core/graphql/getJointPlanningData';
import { ErrorBoundary } from '@sentry/react';
import { ThemePreference } from 'toolkit/core/utilities/monarchSettings';
import Spinner from 'toolkit/components/spinner/component';
import SideDrawer from 'toolkit/components/side-drawer/component';
import { BudgetRollupCalculator } from 'toolkit/core/calculators/budgetRollupCalculator';
import { RollupComponent, RollupData } from './rollup';

interface State {
  canRollup: boolean,
  rollupAmount: number
}

export function ReadyToAssignComponent({ settings }: { settings: any }) {

  //const userSettingsContext = useContext(UserSettingsContext);

  const isDark = settings?.theme === 'dark';

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
    theme: settings?.theme === 'dark' ? ThemePreference.dark : ThemePreference.light,
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
    <div>
      <ErrorBoundary fallback={<div>Error</div>}>
        {!loading ? (
          <$Widget id='mmtk-ready-to-assign' $isDark={isDark}>
            <$WidgetTitle>Ready To Assign</$WidgetTitle>
            <$FlexContainerRoot>
              <$TotalCharges>{formatCurrency(state.rollupAmount)}</$TotalCharges>
              {state.canRollup && (
                <$FlatButton $color={"#32AAF0"} $ghost={isDark} onClick={() => onRollupClicked()}>Rollup Last Month</$FlatButton>
              )}
            </$FlexContainerRoot>
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
        ) : (<Spinner />)
        }
      </ErrorBoundary>
    </div>
  );
}