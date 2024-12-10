import { features } from '@extension/features';

export function DashboardSettings() {
  const featureInstances = features.featureInstances
    .filter(feat => feat.featureTarget === 'dashboard-widgets' || feat.featureTarget === 'dashboard')
    .map(f => f.getSettingsComponent());

  return (
    <>
      <div className="flex flex-col">{featureInstances && <>{featureInstances}</>}</div>
    </>
  );
}
