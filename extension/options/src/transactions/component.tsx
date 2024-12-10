import { features } from '@extension/features';

export function TransactionSettings() {
  const featureInstances = features.featureInstances
    .filter(feat => feat.featureTarget === 'transactions')
    .map(f => f.getSettingsComponent());

  return (
    <>
      <div className="flex flex-row">{featureInstances && <>{featureInstances}</>}</div>
    </>
  );
}
