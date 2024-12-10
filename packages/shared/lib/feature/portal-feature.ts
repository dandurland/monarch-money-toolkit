import { ReactElement } from 'react';
import { ComponentFeature } from './component-feature';

export abstract class PortalFeature extends ComponentFeature {
  abstract getPortal(): ReactElement;
}
