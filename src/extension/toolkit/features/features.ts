import { Feature } from "./feature";
import { ColorOverspentCategoriesFeature } from "./budget/color-overspent-categories";
import { EffectiveBalanceFeature } from "./dashboard/effective-balance";
import { ReadyToAssignFeature } from "./dashboard/ready-to-assign";
import { WidgetsFeature } from "./dashboard/host";

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
      //const cocs = settings['ColorOverspentCategoriesFeature'];
      const feature = new ColorOverspentCategoriesFeature();
      feature.settings = { enabled: true };
      this.instances.push(feature);
    }

    {
      const feature = new WidgetsFeature();
      feature.settings = {};
      feature.settings.widgets = this.instances.slice(0, 2);
      this.instances.push(feature);
    }
  }

  get featureInstances(): Feature[] {
    return this.instances;
  }
}