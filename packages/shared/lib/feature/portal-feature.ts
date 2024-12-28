import type { ReactElement } from 'react';
import { ComponentFeature } from './component-feature';
import type { EnabledStorage, EnabledSettings } from '@extension/storage';

export abstract class PortalFeature<Storage extends EnabledStorage<EnabledSettings>> extends ComponentFeature<Storage> {
  abstract getPortal(): ReactElement;
}
