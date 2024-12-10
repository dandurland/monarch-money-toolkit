import { ComponentFeature } from './component-feature';

export abstract class WidgetFeature extends ComponentFeature {
  constructor(public featureName: string) {
    super('dashboard-widgets', featureName);
  }
}
