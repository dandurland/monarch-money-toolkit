import { features } from '@extension/features';
import { FeatureSettings } from '@src/settings';

export function DashboardSettings() {
  const featureInstances = features.featureInstances.filter(
    feat => feat.featureTarget === 'dashboard-widgets' || feat.featureTarget === 'dashboard',
  );

  return (
    <>
      <div className="flex flex-col">
        {featureInstances && (
          <>
            {featureInstances.map(feat => (
              <FeatureSettings feature={feat} key={feat.name} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
