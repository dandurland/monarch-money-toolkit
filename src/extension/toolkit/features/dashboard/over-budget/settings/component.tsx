import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Select, { MultiValue } from 'react-select';
import { toolkitStorage } from 'toolkit/core/common/storage';
import { useSuspenseQuery } from '@apollo/client';
import ToggleSwitch from 'toolkit/components/toggle-switch/component';
import { GetAccounts } from 'toolkit/core/graphql/getAccounts';
import { $SettingInfo, $SettingTitle, $SettingDescription, $SettingContainer, $SettingOptions, $SettingButton } from 'toolkit/extension/options/component/options.sc';

export function OverBudgetSettings({ settings }: { settings: any }) {

  settings = settings ?? { enabled: false };

  const [isHidden, setHidden] = useState(!settings.enabled);
  const [isEnabled, setEnabled] = useState(settings.enabled);
  const [selectedDepositoryAccounts, setSelectedDepositoryAccounts] = useState<MultiValue<{ value: string, label: string }>>();
  const [selectedCreditAccounts, setSelectedCreditAccounts] = useState<MultiValue<{ value: string, label: string }>>();

  const accountData = useSuspenseQuery(GetAccounts);

  const depositoryAccounts: { value: string, label: string }[] = [];
  const selectedDepository: { value: string, label: string }[] = [];
  const creditAccounts: { value: string, label: string }[] = [];
  const selectedCredit: { value: string, label: string }[] = [];

  for (const account of accountData.data?.accounts) {

    const item = { value: account.id, label: account.displayName };

    switch (account.type.name) {
      case 'depository': {
        depositoryAccounts.push(item);
        if (settings?.assetAccountIds?.includes(account.id)) {
          selectedDepository.push(item);
        }
        break;
      }
      case 'credit': {
        creditAccounts.push(item);
        if (settings?.creditAccountIds?.includes(account.id)) {
          selectedCredit.push(item);
        }
        break;
      }
    }
  }

  function saveSettings(enabled: boolean) {

    if (!enabled) {
      settings.enabled = false;
      return toolkitStorage.setItem('OverBudgetFeature', settings);
    }

    const depositoryAccountIds: string[] = [];
    const creditAccountIds: string[] = [];

    for (const account of selectedCreditAccounts!) {
      creditAccountIds.push(account.value);
    }

    for (const account of selectedDepositoryAccounts!) {
      depositoryAccountIds.push(account.value);
    }

    const value = {
      enabled: true,
      assetAccountIds: depositoryAccountIds,
      creditAccountIds: creditAccountIds
    }

    return toolkitStorage.setItem('OverBudgetFeature', value);
  };

  function canSave(): boolean {

    return isEnabled
      && selectedDepositoryAccounts !== undefined && selectedDepositoryAccounts.length > 0
      && selectedCreditAccounts !== undefined && selectedCreditAccounts.length > 0;
  }

  async function handleToggle(enabled: boolean) {

    setEnabled(enabled);
    setHidden(!enabled);

    if (!enabled) {
      await saveSettings(enabled);
    }
  }

  useEffect(() => {

    setEnabled(settings?.enabled && selectedCredit.length > 0 && selectedDepository.length > 0);
    setSelectedDepositoryAccounts(selectedDepository);
    setSelectedCreditAccounts(selectedCredit);

  }, []);

  return (
    <>
      <ToggleSwitch id="overbudgetEnabled" checked={isEnabled} onChange={(checked) => handleToggle(checked)} />
      <$SettingInfo> 
        <div><$SettingTitle>Over Budget</$SettingTitle>
        <$SettingDescription><p>Display over budget categories for the current month</p></$SettingDescription></div>
        <Suspense fallback={<div>Loading...</div>}>
          <$SettingContainer $hidden={isHidden}>
            <$SettingOptions>
              <span>Depository Accounts</span>
              <Select
                isMulti
                value={selectedDepositoryAccounts}
                onChange={setSelectedDepositoryAccounts}
                options={depositoryAccounts}
                isDisabled={!isEnabled}
              />

              <span>Credit Accounts</span>
              <Select
                isMulti
                onChange={setSelectedCreditAccounts}
                value={selectedCreditAccounts}
                options={creditAccounts}
                isDisabled={!isEnabled}
              />
            </$SettingOptions>

            <$SettingButton $color={'#32AAF0'} onClick={() => saveSettings(isEnabled)} disabled={!canSave()}>Save</$SettingButton>
          </$SettingContainer>
        </Suspense>
      </$SettingInfo>
    </>
  );
}