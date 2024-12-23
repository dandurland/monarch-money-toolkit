import { features } from '@extension/features';
import { ErrorBoundary } from '@extension/shared';
import { FeatureSettings } from '@src/settings';

export function DashboardSettings() {
  const featureInstances = features.featureInstances.filter(
    feat => feat.featureTarget === 'dashboard-widgets' || feat.featureTarget === 'dashboard',
  );
  //.map(f => f.getSettingsComponent());

  return (
    <>
      <div className="flex flex-col">
        {featureInstances && (
          <>
            {featureInstances.map(feat => (
              <FeatureSettings feature={feat} />
            ))}
          </>
        )}
      </div>
    </>
  );
}

/* <EnabledSettingsTest featureStorage={feat.getEnabledStorage()} enabledToggled={ async () => {}}>
                    {feat.getSettingsComponent()}
                  </EnabledSettingsTest>
                  */
