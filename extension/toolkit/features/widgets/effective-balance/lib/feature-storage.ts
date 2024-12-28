import type { EnabledSettings, EnabledStorage } from '@extension/storage';
import { createEnabledStorage } from '@extension/storage';

export type Settings = EnabledSettings & {
  depositoryAccountIds: string[];
  creditAccountIds: string[];
};

export const featureStorage: EnabledStorage<Settings> = createEnabledStorage<Settings>(
  'effective-balance-widget',
  {
    enabled: false,
    depositoryAccountIds: [],
    creditAccountIds: [],
  },
  async () => {
    //isValid
    const { depositoryAccountIds, creditAccountIds } = await featureStorage.get();
    return depositoryAccountIds.length > 0 || creditAccountIds.length > 0;
  },
);
