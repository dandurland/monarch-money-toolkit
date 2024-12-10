import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

export type ToolkitTheme = 'light' | 'dark' | 'system';

type ThemeStorage = BaseStorage<ToolkitTheme>;

const storage = createStorage<ToolkitTheme>('toolkit-theme', 'system', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const toolkitThemeStorage: ThemeStorage = {
  ...storage,
};
