import staticTheme from './staticTheme';
import { getThemeColors } from './getThemeColors';
import { ToolkitTheme } from './getUITheme';

export const makeTheme = (uiTheme : ToolkitTheme) => {
  const color = getThemeColors();

  const spacing = {
    ...staticTheme.spacing,
    gutter: '16px'
  };

  return {
    ...staticTheme,
    spacing,
    color,
    uiTheme,
  } as const;
};