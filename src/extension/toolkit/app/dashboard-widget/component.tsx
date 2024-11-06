import React from 'react';
import Portal from "../portal";
import { WidgetHost } from "toolkit/extension/toolkit/features/dashboard/host/component";
import { useLoaderData } from 'react-router';
import { ThemePreference } from 'toolkit/core/utilities/monarchSettings';
import { Widget } from '../../features/dashboard/widget';
import {
  $WidgetHeader,
  $WidgetRoot
} from 'toolkit/components/styles/widget-styles.sc';

export interface DashboardWidgetSettings {
  theme: ThemePreference,
  widgets: Widget[]
};

export function DashboardWidget() {

  const settings = useLoaderData() as DashboardWidgetSettings;

  const mount = document.getElementById("mmtk-dashboard-widget-root")
    ?? Object.assign(document.createElement('div'), { id: "mmtk-dashboard-widget-root" });

  const scrollRoot = document.querySelectorAll('[class*=Dashboard__DroppableColumn]')[1];
  scrollRoot.insertBefore(mount, scrollRoot.children[0]);

  const isDark = settings?.theme === 'dark';
  const widgetInstances: Widget[] = settings?.widgets;

  const widgets = widgetInstances
    .filter((w) => w.settings.enabled)
    .map((w) => w.getComponent());

  return (
    <>
      <Portal mount={mount}>
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
      </Portal>
    </>
  );
}

/*export function DashboardWidget() {

  const data = useLoaderData() as DashboardWidgetSettings;

  const mount = document.getElementById("mmtk-dashboard-widget-root")
    ?? Object.assign(document.createElement('div'), { id: "mmtk-dashboard-widget-root" });

  const scrollRoot = document.querySelectorAll('[class*=Dashboard__DroppableColumn]')[1];
  scrollRoot.insertBefore(mount, scrollRoot.children[0]);

  return (
    <>
      <Portal mount={mount}>
        <WidgetHost settings={data} />
      </Portal>
    </>
  );

}*/