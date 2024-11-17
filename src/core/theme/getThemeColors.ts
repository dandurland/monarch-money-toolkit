import { getUITheme, ToolkitTheme } from "./getUITheme";
import darkThemeColors from "./dark";
import lightThemeColors from "./light";

export function getThemeColors() {
  const uiTheme = getUITheme();

  return uiTheme === ToolkitTheme.dark ? darkThemeColors : lightThemeColors;
}