import { getMonarchTheme, ThemePreference } from "../utilities/monarchSettings";

export enum ToolkitTheme {
  light = 'light',
  dark = 'dark'
}

export function getUITheme() : ToolkitTheme {

  const monarchTheme = getMonarchTheme();

  if(monarchTheme !== ThemePreference.system) {
    return monarchTheme === ThemePreference.dark
      ? ToolkitTheme.dark
      : ToolkitTheme.light;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ToolkitTheme.dark
    : ToolkitTheme.light
}