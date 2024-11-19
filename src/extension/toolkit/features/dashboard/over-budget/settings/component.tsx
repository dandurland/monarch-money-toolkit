import * as React from 'react';
import { useState } from 'react';
import { toolkitStorage } from 'toolkit/core/common/storage';
import ToggleSwitch from 'toolkit/components/toggle-switch/component';
import { $SettingInfo, $SettingTitle, $SettingDescription } from 'toolkit/extension/options/component/options.sc';

export function OverBudgetSettings({ settings }: { settings: any }) {

  settings = settings ?? { enabled: false };

  const [isEnabled, setEnabled] = useState(settings.enabled);
  
  async function handleToggle(enabled: boolean) {

    setEnabled(enabled);
    settings.enabled = enabled;
    return toolkitStorage.setItem('OverBudgetFeature', settings);
  }

  return (
    <>
      <ToggleSwitch id="overbudgetEnabled" checked={isEnabled} onChange={(checked) => handleToggle(checked)} />
      <$SettingInfo> 
        <div><$SettingTitle>Over Budget</$SettingTitle>
        <$SettingDescription><p>Display over budget categories for the current month</p></$SettingDescription></div>
      </$SettingInfo>
    </>
  );
}