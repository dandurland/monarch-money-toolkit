class FeaturesStore {

  private listeners: any[] = [];
  settings: any = {};

  subscribe(listener: any) {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getSnapshot() {
    return this.settings;
  }

  getSettingSnapshot(key: string) : any {
    return this.settings[key];
  }

  settingsChanged(settings: any) {
    this.settings = settings;
    this.emitChange();
  }

  settingChanged(key: string, value: any) {

    const obj: Record<string, any> = {};
    obj[key] = value;

    this.settings = {...this.settings, ...obj};
    
    this.emitChange();
  }

  private emitChange() {
    for (let listener of this.listeners) {
      listener(this.settings);
    }
  }

}

export default new FeaturesStore();