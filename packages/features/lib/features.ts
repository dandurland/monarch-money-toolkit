import type { Feature } from '@extension/shared';
import { TransactionRowHeightFeature } from '@extension/transaction-row-height-feature';
import { OverBudgetFeature } from '@extension/over-budget-widget';
import { OverBudgetCountFeature } from '@extension/over-budget-count-feature';
import { BudgetRowHeightFeature } from '@extension/budget-row-height-feature';
import { EffectiveBalanceFeature } from '@extension/effective-balance-widget';
//import { PendingTransactionDisplayFeature } from '@extension/pending-transaction-display-feature';
import type { EnabledStorage, EnabledSettings } from '@extension/storage';

export class Features {
  private instances: Feature<EnabledStorage<EnabledSettings>>[] = [];

  constructor() {
    {
      const feature = new TransactionRowHeightFeature();
      this.instances.push(feature);
    }

    {
      const feature = new OverBudgetFeature();
      this.instances.push(feature);
    }

    {
      const feature = new OverBudgetCountFeature();
      this.instances.push(feature);
    }

    {
      const feature = new BudgetRowHeightFeature();
      this.instances.push(feature);
    }

    {
      const feature = new EffectiveBalanceFeature();
      this.instances.push(feature);
    }

    /*{
      const feature = new PendingTransactionDisplayFeature();
      this.instances.push(feature);
    }*/
  }

  get featureInstances(): Feature<EnabledStorage<EnabledSettings>>[] {
    return this.instances;
  }
}

export const features = new Features();
