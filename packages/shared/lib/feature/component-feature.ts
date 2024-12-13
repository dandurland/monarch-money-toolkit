import type { ReactElement } from 'react';
import { Feature } from './feature';

export abstract class ComponentFeature extends Feature {
  abstract getComponent(): ReactElement;
}
