import { Switch } from '@extension/ui';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { useStorage } from '../hooks';
import { useState } from 'react';

export function EnabledSettings<Data extends EnabledSettings>({
  featureStorage,
  children,
}: {
  featureStorage: EnabledStorage<Data>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}) {
  const settings = useStorage(featureStorage);

  return (
    <>
      <div className="flex w-full grow flex-row items-center justify-between gap-2">
        <Switch id="extension-enabled" checked={settings.enabled} onCheckedChange={featureStorage.toggleEnabled} />
        <div className="grow">{children}</div>
      </div>
    </>
  );
}

export function EnabledSettingsExt({
  enabled,
  enabledToggled,
  children,
}: {
  enabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enabledToggled: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const enabledChanged = () => {
    setIsEnabled(!isEnabled);
    enabledToggled();
  };

  return (
    <>
      <div className="flex w-full grow flex-row items-center justify-between gap-2">
        <Switch id="extension-enabled" checked={isEnabled} onCheckedChange={enabledChanged} />
        <div className="grow">{children}</div>
      </div>
    </>
  );
}

export function EnabledSettingsTest<Data extends EnabledSettings>({
  featureStorage,
  enabledToggled,
  children,
}: {
  featureStorage: EnabledStorage<Data>;
  enabledToggled: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}) {
  const { enabled } = useStorage(featureStorage);
  const enabledChanged = async () => {
    if (enabledToggled) {
      await enabledToggled();
    }
  };

  return (
    <>
      <div className="flex w-full grow flex-row items-center justify-between gap-2">
        <Switch id="extension-enabled" checked={enabled} onCheckedChange={enabledChanged} />
        <div className="grow">{children}</div>
      </div>
    </>
  );
}
