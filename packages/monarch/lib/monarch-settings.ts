import { isNil } from '@extension/core';
import { makePersistRoot } from './persist-root';

export enum ThemePreference {
  system = 'system',
  light = 'light',
  dark = 'dark',
}

export interface User {
  readonly token: string;
}

export interface PersistentUi {
  readonly themePreference: ThemePreference;
}

export interface MonarchSettings {
  readonly user: User;
  readonly persistentUi: PersistentUi;
}

export function getMonarchTheme(): ThemePreference {
  const json = localStorage.getItem('persist:root');
  if (isNil(json)) {
    return ThemePreference.system;
  }
  const root = makePersistRoot(json);

  return (root.persistentUi?.themePreference as ThemePreference) ?? ThemePreference.system;
}
