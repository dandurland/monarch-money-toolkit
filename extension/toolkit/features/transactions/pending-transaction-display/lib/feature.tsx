//import $ from 'jquery';
import '@extension/ui/dist/global.css';

import type { ReactElement } from 'react';
import { Fragment } from 'react';
import { ErrorBoundary, Portal, PortalFeature } from '@extension/shared';
import { featureStorage } from './feature-storage';
import { objectIs } from '@extension/core';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { PendingTransactionList } from './components';

export class PendingTransactionDisplayFeature extends PortalFeature<EnabledStorage<EnabledSettings>> {
  private id: string = `mmtk-pending-transaction-display-root`;

  constructor() {
    super(
      'transactions',
      'Pending Transaction Display',
      'Displays pending transaction at the top of the transaction list',
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

      settings = value ?? { enabled: false };
      this.onSettingsChanged(settings);
    });
  }

  getComponent(): ReactElement {
    const key = 'pending-transaction-display';
    return (
      <Fragment key={key}>
        <ErrorBoundary fallback={<></>}>
          <PendingTransactionList />
        </ErrorBoundary>
      </Fragment>
    );
  }

  getPortal() {
    const mount = document.getElementById(this.id) ?? Object.assign(document.createElement('div'), { id: this.id });

    //const $firstTransaction = $('[data-index="1"]').first();
    //$(mount).append($firstTransaction.clone(true, true));
    //$parent.append(('<div data-index="1"></div>'));

    const scrollRoot = document.querySelectorAll('[class*=Page__Root]')[0];
    scrollRoot.insertBefore(mount, scrollRoot.children[1]);

    if (!scrollRoot) {
      return <></>;
    }

    return (
      <>
        <Portal mount={mount}>{this.getComponent()}</Portal>
      </>
    );
  }

  shouldMount(pathname: string): boolean {
    return pathname === '/transactions';
  }

  get hasSettings() {
    return false;
  }

  destroy(): void {}

  private onSettingsChanged(settings: EnabledSettings | null) {
    if (settings?.enabled) {
      return;
    }

    this.disable();
  }

  private disable(): void {
    const el = document.querySelector(`#${this.id}`);
    el?.remove();

    const style = document.querySelector(`#${this.id}-style`);
    style?.remove();
  }
}
