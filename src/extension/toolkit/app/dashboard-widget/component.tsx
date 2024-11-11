import React from 'react';
import Portal from "../portal";
import { useLoaderData } from 'react-router';
import { ThemePreference } from 'toolkit/core/utilities/monarchSettings';
import { Widget } from '../../features/dashboard/widget';
import {
  $WidgetHeader,
  $WidgetRoot,
} from 'toolkit/components/styles/widget-styles.sc';
import { ToolkitTheme } from 'toolkit/core/utilities/theme';

export interface DashboardWidgetSettings {
  theme: ToolkitTheme,
  widgets: Widget[]
};

export function DashboardWidget() {

  const settings = useLoaderData() as DashboardWidgetSettings;

  const mount = document.getElementById("mmtk-dashboard-widget-root")
    ?? Object.assign(document.createElement('div'), { id: "mmtk-dashboard-widget-root" });

  const scrollRoot = document.querySelectorAll('[class*=Dashboard__DroppableColumn]')[1];
  scrollRoot.insertBefore(mount, scrollRoot.children[0]);

  const widgetInstances: Widget[] = settings?.widgets;

  const widgets = widgetInstances
    .filter((w) => w.settings.enabled)
    .map((w) => w.getComponent(settings.theme));

  return (
    <>
      <Portal mount={mount}>
        <$WidgetRoot $theme={settings?.theme}>
          <$WidgetHeader $theme={settings?.theme}>
            <span>Monarch Money Toolkit</span>
          </$WidgetHeader>
          {widgets &&
            <>
              {widgets}
            </>
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