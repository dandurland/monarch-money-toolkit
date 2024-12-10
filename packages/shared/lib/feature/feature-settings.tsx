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
      <div className="flex flex-row w-full items-center justify-between gap-2 flex-grow">
        <Switch id="extension-enabled" checked={settings.enabled} onCheckedChange={featureStorage.toggleEnabled} />
        <div className="flex-grow">{children}</div>
      </div>
    </>
  );
}
