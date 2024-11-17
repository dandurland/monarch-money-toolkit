import React from 'react';
import Portal from "../portal";
import styled, { ThemeProvider } from 'styled-components';
import { useLoaderData } from 'react-router';
import { Widget } from '../../features/dashboard/widget';
import {
  $WidgetHeader,
  $WidgetRoot,
} from 'toolkit/components/styles/widget-styles.sc';
import { ToolkitTheme } from 'toolkit/core/theme/getUITheme';
import { makeTheme } from 'toolkit/core/theme/makeTheme';

const $WidgetRowRoot = styled.div<{ $theme?: ToolkitTheme }>`
  border-top: 5px solid ${props => props.$theme === ToolkitTheme.dark ? '#082043' : '#f4f8f0'};
`;

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
    .map((w) => <$WidgetRowRoot key={w.featureName} $theme={settings.theme}>{w.getComponent(settings.theme)}</$WidgetRowRoot>);

  const theme = makeTheme();

  return (
    <>
      <Portal mount={mount}>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
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