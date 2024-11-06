import { ReactNode } from 'react';
import { Feature } from '../feature';

export class Widget extends Feature {

  widgetName = this.constructor.name;

  getComponent(): ReactNode {
    throw Error('Required getNode func not implemented');
  }
}