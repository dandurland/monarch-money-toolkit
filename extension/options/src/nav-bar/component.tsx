import { features } from '@extension/features';

export function NavBarSettings() {
  const featureInstances = features.featureInstances
    .filter(feat => feat.featureTarget === 'nav-bar')
    .map(f => f.getSettingsComponent());

  return (
    <>
      <div className="flex flex-row">{featureInstances && <>{featureInstances}</>}</div>
    </>
  );
}
