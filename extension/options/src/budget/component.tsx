import { features } from '@extension/features';
import { FeatureGroup } from '@src/components/feature-group';

export function BudgetSettings() {
  const featureInstances = features.featureInstances.filter(feat => feat.featureTarget === 'budget');
  return <FeatureGroup features={featureInstances} />;
}
