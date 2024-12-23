import { ErrorBoundary, Feature, useStorage } from '@extension/shared';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Switch } from '@extension/ui';
import { useState } from 'react';

export function FeatureSettings({ feature }: { feature: Feature }) {
  const { enabled } = useStorage(feature.getEnabledStorage());

  const [isEnabled, setIsEnabled] = useState(enabled);

  const enabledChanged = async () => {
    setIsEnabled(!isEnabled);

    if (!feature.getSettingsComponent(true)) {
      await feature.getEnabledStorage().toggleEnabled();
    }
  };

  return (
    <ErrorBoundary fallback={<div>{`{Error in ${feature.featureName} settings.}`}</div>}>
      <div className="flex w-full grow flex-row items-center justify-between gap-2">
        <Switch id="extension-enabled" checked={isEnabled} onCheckedChange={enabledChanged} />
        <div className="grow">
          <Card className={isEnabled ? '' : 'pointer-events-none opacity-40'}>
            <CardHeader>
              <CardTitle>{feature.featureName}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>{feature.getSettingsComponent(isEnabled) ?? <></>}</CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
