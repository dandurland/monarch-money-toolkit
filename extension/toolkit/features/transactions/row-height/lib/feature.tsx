import $ from 'jquery';
import large from './large.css?raw';
import compact from './compact.css?raw';
import { Feature } from '@extension/shared';
import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { TransactionRowHeightSettings } from './settings';
import { objectIs } from '@extension/core';
import type { Settings } from './feature-storage';
import { featureStorage } from './feature-storage';
import type { EnabledStorage, EnabledSettings } from '@extension/storage';

type Options = 'compact' | 'default' | 'large';

export class TransactionRowHeightFeature extends Feature<EnabledStorage<EnabledSettings>> {
  private id: string = `mmtk-transaction-row-height-feature-style`;

  constructor() {
    super(
      'transactions',
      'Transaction Row Height',
      'Change transaction row height',
      featureStorage as unknown as EnabledStorage<EnabledSettings>,
    );
  }

  async initialize(): Promise<void> {
    let settings = await featureStorage.get();
    this.onSettingsChanged(settings);

    featureStorage.subscribe(() => {
      const value = featureStorage.getSnapshot();
      if (objectIs(value, settings)) {
        return;
      }

      settings = value ?? { enabled: false, size: 'default' };
      this.onSettingsChanged(settings);
    });
  }

  destroy(): void {
    this.disable();
  }

  async getSettingsJson(): Promise<string> {
    const settings = await featureStorage.get();
    return JSON.stringify(settings);
  }

  getSettingsComponent(enabled: boolean): ReactElement {
    const key = 'transaction-row-height-settings'; //uid();
    return (
      <Fragment key={key}>
        <TransactionRowHeightSettings enabled={enabled} />
      </Fragment>
    );
  }

  private onSettingsChanged(settings: Settings | null) {
    if (settings?.enabled) {
      this.enable(settings?.size ?? 'default');
      return;
    }

    this.disable();
  }

  private enable(value: Options) {
    const css = this.css(value);
    if (!css) {
      this.destroy();
      return;
    }

    const style = $('<style>', {
      id: this.id,
      type: 'text/css',
    }).text(css);

    if (style) {
      const existingStyle = document.querySelector(`#${this.id}`);
      if (existingStyle) {
        $(existingStyle).replaceWith(style);
      } else {
        $('head').append(style);
      }
    }
  }

  private disable(): void {
    const existingStyle = document.querySelector(`#${this.id}`);
    existingStyle?.remove();
  }

  private css(value: Options): string | null {
    switch (value) {
      case 'compact':
        return compact;
      case 'large':
        return large;
      default:
        return null;
    }
  }
}
