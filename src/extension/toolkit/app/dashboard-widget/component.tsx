import React from 'react';
import Portal from "../portal";
import styled, { ThemeProvider } from 'styled-components';
import { useLoaderData } from 'react-router';
import { Widget } from '../../features/dashboard/widget';
import { $FlexContainer } from 'toolkit/components/styles/flex-container.sc';
import { ToolkitTheme } from 'toolkit/core/theme/getUITheme';
import { makeTheme } from 'toolkit/core/theme/makeTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutboundMessageType } from 'toolkit/messages';

const $WidgetRowRoot = styled.div`
  border-top: 5px solid ${({ theme }) => theme.color.grayLightBackground};
`;

const $WidgetRoot = styled($FlexContainer).attrs({ column: true, justifyStart: true })`
  border-radius: 8px;
  box-shadow: rgba(0, 40, 100, 0.04) 0px 4px 8px;
  background-color: ${({ theme }) => theme.color.white};
`;

const $WidgetHeader = styled($FlexContainer).attrs({ justifyStart: true })`
  margin: 0px;
  gap: 0px;
  padding: 20px 20px 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayBackground};
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
`;

const $OptionsButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.uiTheme === ToolkitTheme.dark ? theme.color.blueLight : theme.color.blueDark };
  cursor: pointer;
`;

export interface DashboardWidgetSettings {
  uiTheme: ToolkitTheme
  widgets: Widget[]
};

export function DashboardWidget() {

  const { uiTheme, widgets } = useLoaderData() as DashboardWidgetSettings;

  const mount = document.getElementById("mmtk-dashboard-widget-root")
    ?? Object.assign(document.createElement('div'), { id: "mmtk-dashboard-widget-root" });

  const scrollRoot = document.querySelectorAll('[class*=Dashboard__DroppableColumn]')[1];
  scrollRoot.insertBefore(mount, scrollRoot.children[0]);

  const widgetInstances = widgets
    .filter((w) => w.settings.enabled)
    .map((w) => <$WidgetRowRoot key={w.featureName}>{w.getComponent()}</$WidgetRowRoot>);

  const theme = makeTheme(uiTheme);

  const onOpenOptionsClicked = () => {
    window.postMessage({ type: OutboundMessageType.OpenOptionsPage }, '*');
  }

  return (
    <>
      <Portal mount={mount}>
        <ThemeProvider theme={theme}>
          <$WidgetRoot>
            <$WidgetHeader>
              <span>Monarch Money Toolkit</span>
              <$OptionsButton onClick={() => onOpenOptionsClicked()}><FontAwesomeIcon icon={['fas', 'cog']} /></$OptionsButton>
            </$WidgetHeader>
            {widgetInstances &&
              <>
                {widgetInstances}
              </>
            }
          </$WidgetRoot>
        </ThemeProvider>
      </Portal>
    </>
  );
}