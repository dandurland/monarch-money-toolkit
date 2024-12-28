import { features } from '@extension/features';
import { FeatureSettings } from '@src/settings';

/*export function NavBarSettings() {
  const featureInstances = features.featureInstances
    .filter(feat => feat.featureTarget === 'nav-bar')
    .map(f => f.getSettingsComponent());

  return (
    <>
      <div className="flex flex-row">{featureInstances && <>{featureInstances}</>}</div>
    </>
  );
}*/

export function NavBarSettings() {
  const featureInstances = features.featureInstances.filter(feat => feat.featureTarget === 'nav-bar');

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
