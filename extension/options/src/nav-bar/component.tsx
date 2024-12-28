import { features } from '@extension/features';
import { FeatureGroup } from '@src/components/feature-group';

export function NavBarSettings() {
  const featureInstances = features.featureInstances.filter(feat => feat.featureTarget === 'nav-bar');

  return <FeatureGroup features={featureInstances} />;
}
