import { createEnabledStorage } from '@extension/storage';
import type { EnabledSettings } from '@extension/storage';

export type RowSize = 'compact' | 'default' | 'large';

export type Settings = EnabledSettings & {
  size: RowSize;
};

export const featureStorage = createEnabledStorage<Settings>('transation-row-height-feature', {
  enabled: false,
  size: 'default',
});
