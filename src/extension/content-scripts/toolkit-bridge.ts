import { InboundMessageType, OutboundMessageType } from 'toolkit/messages';
import { ExtensionStorage } from 'toolkit/core/common/storage';
import { getUserSettings } from 'toolkit/core/settings';
import { allSettingsLut } from "toolkit/core/settings/settings";
import { getBrowser } from "toolkit/core/common/browser";

export class ToolkitBridge {

  private storage = new ExtensionStorage();

  async initalize() {

    const script = document.createElement('script');
    script.id = 'mm-toolkit';
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL('web-accessibles/mm-toolkit.js'));
    document.getElementsByTagName('head')[0].appendChild(script);
  
    window.addEventListener('message', (event) => this.onToolkitMessage(event));
  
    const _this = this;
    for (const setting of allSettingsLut) {
      this.storage.onStorageItemChanged(setting.name, _this.onFeatureSettingsChange);
    }
  
    const { runtime } = getBrowser();
    runtime.onMessage.addListener(_this.onServiceWorkerMessage);
  }

  private onToolkitMessage(event:any) {
    if (event.data && event.data.type) {
      switch (event.data.type) {
        case OutboundMessageType.ToolkitLoaded: {
          this.bootstrapToolkit();
          break;
        }
        case OutboundMessageType.OpenOptionsPage: {
          const { runtime } = getBrowser();
          runtime.sendMessage(event.data);
          break;
        }
      }
    }
  }

  private onFeatureSettingsChange(name:string, value:string) {
    window.postMessage({
      type: InboundMessageType.SettingChanged,
      settings: {
        name: name,
        value: value
      }
    })
  }

  private onServiceWorkerMessage(message:any, sender:any, sendResponse:any) {

    switch (message.type) {
      case InboundMessageType.Navigation: {
        this.sendToolkitMessage(message);
        break;
      }
    }
  }

  private async bootstrapToolkit() {
    const userSettings = await getUserSettings();
    this.sendToolkitMessage({
      type: InboundMessageType.Bootstrap,
      settings: userSettings,
    });
  }

  private sendToolkitMessage(message: any) {
    window.postMessage(message, '*');
  }
}