import type { Feature } from '@extension/shared';
import { ErrorBoundary, useStorage } from '@extension/shared';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Switch } from '@extension/ui';
import { useState } from 'react';

export function FeatureSettings({ feature }: { feature: Feature<EnabledStorage<EnabledSettings>> }) {
  const { enabled } = useStorage(feature.enabledStorage);

  const [isEnabled, setIsEnabled] = useState(enabled);

  const enabledChanged = async () => {
    setIsEnabled(!isEnabled);

    if (!feature.hasSettings) {
      await feature.enabledStorage.toggleEnabled();
    }
  };

  return (
    <ErrorBoundary fallback={<div>{`{Error in ${feature.name} settings.}`}</div>}>
      <div className="flex w-full grow flex-row items-center justify-between gap-2">
        <Switch id="extension-enabled" checked={isEnabled} onCheckedChange={enabledChanged} />
        <div className="grow">
          <Card className={isEnabled ? '' : 'pointer-events-none opacity-40'}>
            <CardHeader>
              <CardTitle>{feature.name}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            {feature.hasSettings && <CardContent>{feature.getSettingsComponent(isEnabled) ?? <></>}</CardContent>}
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
