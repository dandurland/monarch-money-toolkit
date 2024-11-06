import { getBrowser } from "toolkit/core/common/browser";

type StorageListener = (key: string, value: any) => void;

const STORAGE_AREA = 'local';

export class ExtensionStorage {

  private browser = getBrowser();
  private readonly listeners = new Map<string, StorageListener[]>();

  constructor() {
    this.browser.storage.onChanged.addListener(this.listenForChanges);
  }

  async getFeatureSettings(name: string | null) {
    const all = await this.getItem(name);

    const settings: string[] = [];
    for (const [key] of Object.entries(all)) {
      settings.push(key);
    }
    return settings;
  }

  async getStoredFeatureSettings() {
    const all = await this.getItem(null);

    const settings: string[] = [];
    for (const [key] of Object.entries(all)) {
      settings.push(key);
    }
    return settings;
  }

  setFeatureSettings(name: string, value: any): Promise<void> {
    return this.setItem(name, value);
  }

  async getItemT<T>(key: string | null): Promise<T> {
    const value = await this.getItem(key);
    return value as T;
  }

  getItem(key: string | null): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.browser.storage[STORAGE_AREA].get(key, (data: any) => {
          if (key === null) {
            return resolve(data);
          }

          try {
            return resolve(JSON.parse(data[key]));
          } catch (e) {
            return resolve(data[key]);
          }
        });
      } catch (e) {
        return reject(e);
      }
    });
  }

  setItem(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const update = { [key]: value };
        this.browser.storage[STORAGE_AREA].set(update, resolve);
      } catch (e) {
        reject(e);
      }
    });
  }

  onStorageItemChanged(key: string, callback: StorageListener) {

    if (this.listeners.has(key)) {
      const listeners = this.listeners.get(key);
      this.listeners.set(key, [...listeners!, callback]);
    } else {
      this.listeners.set(key, [callback]);
    }
  }

  private listenForChanges = (changes: { [key: string]: any }, name: string) => {
    if (name !== STORAGE_AREA) return;

    for (const [key, value] of Object.entries(changes)) {
      if (this.listeners.has(key)) {
        const listeners = this.listeners.get(key);
        listeners!.forEach((listener) => {
          listener(key, value.newValue);
        })
      }
    }

  }
}

export const toolkitStorage = new ExtensionStorage();