import * as React from 'react';
import { useState, useEffect } from 'react';
import { toolkitStorage } from 'toolkit/core/common/storage';
import ToggleSwitch from 'toolkit/components/toggle-switch/component';

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
    <div>
      <h3>Color Overspent Categories Red</h3>

      <div className='setting'>
        <ToggleSwitch id="colorOverspentCategoriesEnabled" checked={isEnabled} onChange={(checked) => handleToggle(checked)} />
      </div>

    </div>
  );
}