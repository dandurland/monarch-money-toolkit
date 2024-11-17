import { Feature } from "./feature";
import { ColorOverspentCategoriesFeature } from "./budget/color-overspent-categories";
import { EffectiveBalanceFeature } from "./dashboard/effective-balance";
import { ReadyToAssignFeature } from "./dashboard/ready-to-assign";
import { OverBudgetFeature } from "./dashboard/over-budget/feature";

export class Features {

  private instances: Feature[] = [];

  constructor(private readonly settings: any) {

    {
      const feature = new ReadyToAssignFeature();
      feature.settings = settings['ReadyToAssignFeature'];
      this.instances.push(feature);
    }

    {
      const feature = new EffectiveBalanceFeature();
      feature.settings = settings['EffectiveBalanceFeature'];
      this.instances.push(feature);
    }

    {
      const feature = new OverBudgetFeature();
      feature.settings = settings['OverBudgetFeature'];
      this.instances.push(feature);
    }

    {
      const feature = new ColorOverspentCategoriesFeature();
      feature.settings = settings['ColorOverspentCategoriesFeature'];
      this.instances.push(feature);
    }
  }

  get featureInstances(): Feature[] {
    return this.instances;
  }
}