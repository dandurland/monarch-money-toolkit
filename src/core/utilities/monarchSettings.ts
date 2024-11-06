import { getBrowser } from "../common/browser";
import { AuthInfo } from '../common/storage/models';

export enum ThemePreference {
  system = 'system',
  light = 'light',
  dark = 'dark'
}

export interface User {
  readonly token: string
}

export interface PersistentUi {
  readonly themePreference: ThemePreference;
}

export interface MonarchSettings {
  readonly user: User;
  readonly persistentUi: PersistentUi;
}

export async function getMonarchAuthToken(): Promise<string> {

  const browser = getBrowser();

  if (!browser.extension) {
    return JSON.parse(JSON.parse(localStorage.getItem('persist:root') ?? '{}').user).token;
  }

  const storage = await import(/* webpackMode: "eager" */'../common/storage');
  const authInfo = await storage.toolkitStorage.getItemT<AuthInfo>('auth-info');
  return authInfo.token;
}

export function getMonarchTheme(): ThemePreference {

  return JSON.parse(JSON.parse(localStorage.getItem('persist:root') ?? '{}').persistentUi).themePreference;
}

export function getMonarchSettingsFromLocalStorage(): MonarchSettings | null {
  const settings = localStorage.getItem('persist:root');
  try {
    if (!settings) {
      return null;
    }

    const value = JSON.parse(settings);
    const result: MonarchSettings = {
      user: JSON.parse(value.user),
      persistentUi: JSON.parse(value.persistentUi),
    };

    return result;
  } catch (e) {
    return null;
  }
}

export async function getMonarchSettingsFromTab(tabId: number): Promise<MonarchSettings> {

  const [scripting] = getBrowser();

  const result = await scripting.executeScript({
    target: { tabId: tabId },
    func: () => getMonarchSettingsFromLocalStorage(),
  });

  return result;
}
