import { Switch } from '@extension/ui';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { useStorage } from '../hooks';

export function EnabledSettings<Data extends EnabledSettings>({
  featureStorage,
  children,
}: {
  featureStorage: EnabledStorage<Data>;
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
