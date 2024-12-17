import { features } from '@extension/features';

export function BudgetSettings() {
  const featureInstances = features.featureInstances
    .filter(feat => feat.featureTarget === 'budget')
    .map(f => f.getSettingsComponent());

  return (
    <>
      <div className="flex flex-row">{featureInstances && <>{featureInstances}</>}</div>
    </>
  );
}
