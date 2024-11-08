import * as React from 'react';
import { useState, useEffect } from 'react';
import { toolkitStorage } from 'toolkit/core/common/storage';
import ToggleSwitch from 'toolkit/components/toggle-switch/component';
import { $SettingInfo, $SettingTitle, $SettingDescription } from 'toolkit/extension/options/component/options.sc';

export function ColorOverspentCategoriesSettings({ settings }: { settings: any }) {

  settings = settings ?? { enabled: false };

  const [isEnabled, setEnabled] = useState(settings.enabled);

  async function handleToggle(enabled: boolean) {

    try {

      if (!enabled) {
        settings.enabled = false;
        return toolkitStorage.setItem('ColorOverspentCategoriesFeature', settings);
      }

      const value = {
        enabled: true,
        color: "#F0648C"
      }

      return toolkitStorage.setItem('ColorOverspentCategoriesFeature', value);
    } finally {
      setEnabled(enabled);
    }
  }

  useEffect(() => {

    setEnabled(settings?.enabled);

  }, []);

  return (
    <>
      <ToggleSwitch id="colorOverspentCategoriesEnabled" checked={isEnabled} onChange={(checked) => handleToggle(checked)} />
      <$SettingInfo> 
        <div><$SettingTitle>Color Overspent Categories</$SettingTitle>
        <$SettingDescription><p>Color Overspent Categories Red.</p></$SettingDescription></div>
      </$SettingInfo>
    </>
  );
}