import { ComponentFeature } from './component-feature';

export abstract class WidgetFeature extends ComponentFeature {
  constructor(featureName: string, description: string) {
    super('dashboard-widgets', featureName, description);
  }
}
