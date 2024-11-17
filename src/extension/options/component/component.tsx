import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EffectiveBalanceSettings } from 'toolkit/extension/toolkit/features/dashboard/effective-balance/settings';
import { ReadyToAssignSettings } from 'toolkit/extension/toolkit/features/dashboard/ready-to-assign/settings';
import { ColorOverspentCategoriesSettings } from 'toolkit/extension/toolkit/features/budget/color-overspent-categories/Settings';
import { OverBudgetSettings } from 'toolkit/extension/toolkit/features/dashboard/over-budget/settings';

const $Root = styled.div`
  display: grid;
  grid-template-columns: 15px 1fr;
  grid-template-rows: 50px 1fr;
`;

const $Header = styled.header`
  grid-column: 2/3;
  grid-row: 1/2;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const $Navigation = styled.div`
  grid-column: 1/2;
  grid-row: 2/3;
`;

const $Content = styled.div`
  grid-column: 2/3;
  grid-row: 2/3;
`;
const $SettingsGroupHeader = styled.h2`
  text-align: left;
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
`;

const $SettingsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const $Setting = styled.div<{ $hidden?: boolean }>`

  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: flex-start;
`;

export function Options({ settings }: { settings: any }) {
  return (
    <>
    <$Root>
      <$Header>
        <h2>Monarch Money Toolkit</h2>
        <a href="https://github.com/dandurland/monarch-money-toolkit"><FontAwesomeIcon icon={['fab', 'github']} size="xl" color="black"/></a>
      </$Header>
      <$Navigation></$Navigation>
      <$Content>
        <$SettingsGroupHeader>Dashboard Widgets</$SettingsGroupHeader>
        <$SettingsGroup>
          <$Setting>
            <EffectiveBalanceSettings settings={settings?.EffectiveBalanceFeature} />
          </$Setting>
          <$Setting>
            <OverBudgetSettings settings={settings?.OverBudgetFeature} />
          </$Setting>
          <$Setting>
            <ReadyToAssignSettings settings={settings?.ReadyToAssignFeature} />
          </$Setting>
        </$SettingsGroup>
        <$SettingsGroupHeader>Budget</$SettingsGroupHeader>
        <$SettingsGroup>
          <$Setting>
            <ColorOverspentCategoriesSettings settings={settings?.ColorOverspentCategoriesFeature} />
          </$Setting>
        </$SettingsGroup>
      </$Content>
      </$Root>
    </>
  );
}