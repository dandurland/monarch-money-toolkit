import $  from 'jquery';
import { InboundMessage, InboundMessageType, OutboundMessageType } from 'toolkit/messages';
import { isMMReady } from '../utilities/utility';
import { Feature } from './features/feature';
import { Widget } from './features/dashboard/widget';
import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createMemoryRouter } from 'react-router';
import { Features } from './features/features';
import { Router } from "@remix-run/router";
import Root from './app/root';
import { DashboardWidget } from './app/dashboard-widget/component';
import featureStore from './features/feature-store';
import { getTheme } from 'toolkit/core/utilities/theme';

export class MMToolkit {

  private router?: Router;
  private features?: Features;

  //toolkit entry
  public initalizeToolkit() {
    window.addEventListener('message', this.onInboundMessage);
    window.postMessage({ type: OutboundMessageType.ToolkitLoaded }, '*');
  }

  private initalizeApp() {

    const routes = [
      {
        path: "/",
        element: <Root />,
        children: [
          {
            path: "dashboard",
            loader: () => {
              return {
                theme: getTheme(),
                widgets: this.features?.featureInstances?.filter((f) => f instanceof Widget && f.settings?.enabled).map((f) => f as Widget) ?? []
              }
            },
            element: <DashboardWidget />,
          },
          {
            path: "*"
          }
        ]
      }
    ];

    this.router = createMemoryRouter(routes);

    const reactDiv = document.createElement('div');
    reactDiv.id = 'mmtk-app-root';
    const root = createRoot(reactDiv);
    const rootElement = document.getElementById('root');
    rootElement?.append(reactDiv);

    root.render(
      <StrictMode>
          <RouterProvider router={this.router} />
      </StrictMode>
    );

    const url = new URL(window.location.href);
    this.navigate(url.pathname);
  }

  private injectFeatureCss(instance?: Feature): void {

    const css = instance?.css();

    if (css) {
      const id = `mmtk-${instance?.featureName}-style`;
      const style = $('<style>', {
        id: id,
        type: 'text/css',
      }).text(css);

      if (style) {
        const existingStyle = document.querySelector(`#${id}`);
        if (existingStyle) {
          $(existingStyle).replaceWith(style);
        } else {
          $('head').append(style);
        }
      }
    }
  }

  private initalizeFeature(instance?: Feature): void {
    if (instance instanceof Widget) {
      return;
    }

    instance?.initialize();
  }

  private destroyFeature = (featureName: string) => {
    const style = document.head.querySelector(`#mmtk-${featureName}-style`);
    style?.remove();
    const feature = this.features?.featureInstances.find((f) => f.constructor.name === featureName);
    if (!feature) {
      console.error(`Feature not found: ${featureName}`);
      return;
    }

    const wrappedDestroy = feature.destroy.bind(feature);
    wrappedDestroy();
  };


  private onInboundMessage = (event: InboundMessage) => {

    switch (event.data.type) {
      case InboundMessageType.Bootstrap: {

        this.features = new Features(event.data.settings);
        this.waitForMonarchMoney();

        featureStore.settingsChanged(event.data.settings);

        break;
      }
      case InboundMessageType.SettingChanged: {
        const { name, value } = event.data.settings;

        const feature = this.features?.featureInstances.find(
          ({ constructor }) => constructor.name === name
        );

        if (feature) {

          feature.settings.enabled = value.enabled;

          if(value.enabled)
          {
            featureStore.settingChanged(name, value);

            feature.settings = {...feature.settings, ...value};
            this.injectFeatureCss(feature);
            this.initalizeFeature(feature);
          } else {
            this.destroyFeature(name);
          }
        }
        break;
      }
      case InboundMessageType.Navigation: {

        if (event.data.pathname === '/dashboard') {
          this.features?.featureInstances.forEach(feature => {
            if (feature.settings) {
              this.injectFeatureCss(feature);
              //this.destroyFeature(feature);
              this.initalizeFeature(feature);
            }
          });
        }

        this.navigate(event.data.pathname);
      }
    }
  }

  private initalizeFeatures() {

    this.features?.featureInstances?.forEach((instance) => {
      this.initalizeFeature(instance);
    });
  }

  private initalizeFeatureStyles() {

    this.features?.featureInstances?.filter(x => x.settings?.enabled).forEach((instance) => {
      this.injectFeatureCss(instance);
    });
  }

  private navigate(path: string): void {
    this.router?.navigate(path);
  }

  waitForMonarchMoney() {

    const that = this;
    (function poll() {

      if (!isMMReady()) {
        setTimeout(poll, 250);
        return;
      }

      that.initalizeFeatureStyles();
      that.initalizeFeatures();
      that.initalizeApp();

    })();
  }
}
