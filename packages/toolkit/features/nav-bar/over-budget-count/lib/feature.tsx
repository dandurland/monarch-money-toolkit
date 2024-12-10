import $ from 'jquery';
import '@extension/ui/dist/global.css';
//import styles from './styles.css?raw';

import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { Portal, PortalFeature } from '@extension/shared';
import { OverBudgetCountFeatureSettings } from './settings';
import { featureStorage } from './feature-storage';
import { objectIs } from '@extension/core';
import type { EnabledSettings } from '@extension/storage';
import { OverBudgetCount } from './components';

export class OverBudgetCountFeature extends PortalFeature {
  private id: string = `mmtk-over-budget-count`;

  constructor() {
    super('nav-bar', 'OverBudgetCountFeature');
  }

  async initialize(): Promise<void> {
    let settings = await featureStorage.get();
    this.onSettingsChanged(settings);

    featureStorage.subscribe(() => {
      const value = featureStorage.getSnapshot();
      if (objectIs(value, settings)) {
        return;
      }

      settings = value ?? { enabled: false };
      this.onSettingsChanged(settings);
    });
  }

  getComponent(): ReactElement {
    const key = 'over-budget-count';
    return (
      <Fragment key={key}>
        <OverBudgetCount />
      </Fragment>
    );
  }

  getPortal() {
    return (
      <>
        <Portal mount={$('a[href*="/plan"]')[0]}>{this.getComponent()}</Portal>
      </>
    );
  }

  async getSettingsJson(): Promise<string> {
    const settings = await featureStorage.get();
    return JSON.stringify(settings);
  }

  getSettingsComponent(): ReactElement {
    const key = 'over-budget-count-settings';
    return (
      <Fragment key={key}>
        <OverBudgetCountFeatureSettings />
      </Fragment>
    );
  }

  destroy(): void {
    /*const existing = document.getElementById(CONTAINER_ID);
    if (existing) {
      unmountComponentAtNode(existing);
      existing.remove();
    }*/
  }

  private onSettingsChanged(settings: EnabledSettings | null) {
    if (settings?.enabled) {
      console.log('OverBudgetCountFeature enabled');
      this.enable();
      return;
    }

    console.log('OverBudgetCountFeature disabled');
    this.disable();
  }

  private enable() {
    /*const css = styles;
    if (!css) {
      this.destroy();
      return;
    }

    const existing = document.querySelector(`#${this.id}`);
    if (existing) {
     return;
    }

    const style = $('<style>', {
      id: this.id,
      type: 'text/css',
    }).text(css);

    if (style) {
      const existingStyle = document.querySelector(`#${this.id}-style`);
      if (existingStyle) {
        $(existingStyle).replaceWith(style);
      } else {
        $('head').append(style);
      }
    }

    const el = $('a[href*="/plan"]');
    var count = $(`<span class="mmtk-nav-badge" id=${this.id}>5</span>`);
    el?.append(count);*/
  }

  private disable(): void {
    const el = document.querySelector(`#${this.id}`);
    el?.remove();

    const style = document.querySelector(`#${this.id}-style`);
    style?.remove();
  }
}
