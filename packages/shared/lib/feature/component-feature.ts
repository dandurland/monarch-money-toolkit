import type { ReactNode } from 'react';
import { Feature } from './feature';

export abstract class ComponentFeature extends Feature {
  abstract getComponent(): ReactNode;
}
