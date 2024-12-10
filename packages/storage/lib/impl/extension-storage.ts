import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

export enum AuthStatus {
  NoToken = 'noToken',
  Success = 'success',
  Failure = 'failure',
}

type MonarchSettings = {
  token?: string | null;
  lastAuth: number;
  status: AuthStatus;
};

type ExtensionSettings = {
  monarchSettings: MonarchSettings;
};

type SettingsStorage = BaseStorage<ExtensionSettings>;

const extensionStorage = createStorage<ExtensionSettings>(
  'extension',
  {
    monarchSettings: {
      lastAuth: 0,
      status: AuthStatus.NoToken,
    },
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const extensionSettingsStorage: SettingsStorage = {
  ...extensionStorage,
};
