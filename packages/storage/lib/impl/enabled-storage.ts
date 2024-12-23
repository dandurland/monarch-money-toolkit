import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import { StorageEnum } from '../base/enums';

export type EnabledSettings = {
  enabled: boolean;
};

export type EnabledStorage<Data extends EnabledSettings> = BaseStorage<Data> & {
  toggleEnabled: () => Promise<void>;
  enable(): Promise<void>;
  disable(): Promise<void>;
  isValid: () => Promise<boolean>;
};

export function createEnabledStorage<Data extends EnabledSettings>(
  key: string,
  data?: Data,
  isValid?: () => Promise<boolean>,
) {
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
    enable: async () => {
      const { enabled } = await enabledStorage.get();
      if (enabled) {
        return Promise.resolve();
      }

      await enabledStorage.patch({ enabled: true } as Data);
    },
    disable: async () => {
      const { enabled } = await enabledStorage.get();
      if (!enabled) {
        return Promise.resolve();
      }

      await enabledStorage.patch({ enabled: false } as Data);
    },
    isValid: async () => {
      if (isValid) {
        return isValid();
      }

      return Promise.resolve(true);
    },
  };

  return enabledStorage;
}

export const toolkitEnabledStorage = createEnabledStorage('toolkit-enabled');
