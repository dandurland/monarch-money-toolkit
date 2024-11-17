import { ReactNode } from 'react';
import { Feature } from '../feature';
import { ToolkitTheme } from 'toolkit/core/theme/getUITheme';

export class Widget extends Feature {

  widgetName = this.constructor.name;

  getComponent(theme: ToolkitTheme): ReactNode {
    throw Error('Required getNode func not implemented');
  }
}