import staticTheme from './staticTheme';
import { getThemeColors } from './getThemeColors';

export const makeTheme = () => {
  const color = getThemeColors();

  const spacing = {
    ...staticTheme.spacing,
    gutter: '16px'
  };

  return {
    ...staticTheme,
    spacing,
    color,
  } as const;
};