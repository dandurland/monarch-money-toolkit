import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import { StorageEnum } from '../base/enums';

export type EnabledSettings = {
  enabled: boolean;
};

export type EnabledStorage<Data extends EnabledSettings> = BaseStorage<Data> & {
  toggleEnabled: () => Promise<void>;
};

export function createEnabledStorage<Data extends EnabledSettings>(key: string, data?: Data) {
  const fallback: Data = data ?? ({ enabled: false } as Data);

  const storage = createStorage<Data>(key, fallback, {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  });

  const enabledStorage: EnabledStorage<Data> = {
    ...storage,
    toggleEnabled: async () => {
      const { enabled } = await enabledStorage.get();
      await enabledStorage.patch({ enabled: !enabled } as Data);
    },
  };

  return enabledStorage;
}

export const toolkitEnabledStorage = createEnabledStorage('toolkit-enabled');
