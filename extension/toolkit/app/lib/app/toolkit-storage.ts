import { createStorage } from '@extension/storage/lib/base/base';
import { StorageEnum } from '@extension/storage/lib/base/enums';

export type Dashboard = {
  widgetOrder: string[];
};

export type State = {
  dashboard: Dashboard;
};

export const toolkitStorage = createStorage<State>(
  'toolkit-settings',
  {
    dashboard: {
      widgetOrder: [],
    },
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);
