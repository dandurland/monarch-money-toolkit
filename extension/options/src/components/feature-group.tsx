import { Feature } from '@extension/shared';
import { EnabledSettings, EnabledStorage } from '@extension/storage';
import { FeatureSettings } from '@src/components/feature-settings';

interface FeatureGroupProps {
  features: Feature<EnabledStorage<EnabledSettings>>[];
}

export function FeatureGroup({ features }: FeatureGroupProps) {
  const ordered = [...features].sort((x, y) => x.featureName.localeCompare(y.featureName, 'en'));

  return (
    <>
      <div className="flex flex-col">
        {features && (
          <>
            {ordered.map(feat => (
              <FeatureSettings feature={feat} key={feat.featureName} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
