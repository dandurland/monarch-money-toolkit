import { ExtensionStorage } from "toolkit/core/common/storage";
import { allSettingsLut } from "./settings";

const storage = new ExtensionStorage();

export function getUserSettings() {
    return storage.getStoredFeatureSettings().then(storedSettings => {
      const settingsPromises = allSettingsLut.map(async setting => {
        const isStored = storedSettings.includes(setting.name);

        if(isStored){
            const value = await storage.getItem(setting.name);
            return value;
        }

        await storage.setFeatureSettings(setting.name, setting.default);
          return await storage.getFeatureSettings(setting.name);
      });

      return Promise.all(settingsPromises).then(settings => {
        const us = allSettingsLut.reduce((allSettings, currentSetting, index) => {
            allSettings[currentSetting.name] = settings[index];
            return allSettings;
        }, {} as Record<string, string>);

        return us;
      });
    });
  }