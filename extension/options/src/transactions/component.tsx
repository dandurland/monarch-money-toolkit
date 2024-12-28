import { features } from '@extension/features';
import { FeatureGroup } from '@src/components/feature-group';

export function TransactionSettings() {
  const featureInstances = features.featureInstances.filter(feat => feat.featureTarget === 'transactions');

  return <FeatureGroup features={featureInstances} />;
}
