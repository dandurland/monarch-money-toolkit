import { features } from '@extension/features';
import { FeatureGroup } from '@src/components/feature-group';

export function DashboardSettings() {
  const featureInstances = features.featureInstances.filter(
    feat => feat.featureTarget === 'dashboard-widgets' || feat.featureTarget === 'dashboard',
  );

  return <FeatureGroup features={featureInstances} />;
}
