import { createEnabledStorage, EnabledSettings } from '@extension/storage';

export type Settings = EnabledSettings & {
  depositoryAccountIds: string[];
  creditAccountIds: string[];
};

export const featureStorage = createEnabledStorage<Settings>('effective-balance-widget', {
  enabled: false,
  depositoryAccountIds: [],
  creditAccountIds: [],
});
