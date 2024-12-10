import type { Feature } from '@extension/shared';
import { TransactionRowHeightFeature } from '@extension/transaction-row-height-feature';
import { OverBudgetFeature } from '@extension/over-budget-widget';
import { OverBudgetCountFeature } from '@extension/over-budget-count-feature';

export class Features {
  private instances: Feature[] = [];

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
  }

  get featureInstances(): Feature[] {
    return this.instances;
  }
}

export const features = new Features();
