import { features } from '@extension/features';
import { FeatureSettings } from '@src/settings';

/*export function BudgetSettings() {
  const featureInstances = features.featureInstances
    .filter(feat => feat.featureTarget === 'budget')
    .map(f => f.getSettingsComponent());

  return (
    <>
      <div className="flex flex-row">{featureInstances && <>{featureInstances}</>}</div>
    </>
  );
}*/

export function BudgetSettings() {
  const featureInstances = features.featureInstances.filter(feat => feat.featureTarget === 'budget');

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
