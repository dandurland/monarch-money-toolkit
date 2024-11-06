import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Select, { MultiValue } from 'react-select';
import { faBug, faCog, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toolkitStorage } from 'toolkit/core/common/storage';
import { useSuspenseQuery } from '@apollo/client';
import ToggleSwitch from 'toolkit/components/toggle-switch/component';
import { GetAccounts } from 'toolkit/core/graphql/getAccounts';

export function EffectiveBalanceSettings({ settings }: { settings: any }) {

  settings = settings ?? { enabled: false };

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
      return toolkitStorage.setItem('EffectiveBalanceFeature', settings);
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

    return toolkitStorage.setItem('EffectiveBalanceFeature', value);
  };

  function canSave(): boolean {

    return isEnabled
      && selectedDepositoryAccounts !== undefined && selectedDepositoryAccounts.length > 0
      && selectedCreditAccounts !== undefined && selectedCreditAccounts.length > 0;
  }

  async function handleToggle(enabled: boolean) {

    setEnabled(enabled);

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
    <div>
      <h3>Effective Balance</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <div className='setting'>

          <ToggleSwitch id="effectiveBalanceEnabled" checked={isEnabled} onChange={(checked) => handleToggle(checked)} />

          <div className='setting-details'>
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
          </div>

          <button onClick={() => saveSettings(isEnabled)} disabled={!canSave()}>
            Save
          </button>
        </div>
      </Suspense>
    </div>
  );
}