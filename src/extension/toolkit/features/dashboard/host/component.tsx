import React from 'react';
import { Widget } from '../widget';
import {
  $WidgetHeader,
  $WidgetRoot
} from 'toolkit/components/styles/widget-styles.sc';
import { ThemePreference } from 'toolkit/core/utilities/monarchSettings';


export interface WidgetHostSettings {
  theme: ThemePreference,
  widgets: Widget[]
}

export function WidgetHost({ settings }: { settings: WidgetHostSettings }) {

  const isDark = settings?.theme === 'dark';
  const widgetInstances: Widget[] = settings?.widgets;

  const widgets = widgetInstances
    .filter((w) => w.settings.enabled)
    .map((w) => w.getComponent());

  return (
    <>
      <$WidgetRoot $isDark={isDark}>
        <$WidgetHeader $isDark={isDark}>
          <span>Monarch Money Toolkit</span>
        </$WidgetHeader>
        {widgets &&
          <div>
            {widgets}
          </div>
        }
      </$WidgetRoot>
    </>
  );
}