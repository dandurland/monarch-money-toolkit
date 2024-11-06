import { InboundMessageType, OutboundMessageType } from 'toolkit/messages';
import { ExtensionStorage } from 'toolkit/core/common/storage';
import { getUserSettings } from 'toolkit/core/settings';
import { allSettingsLut } from "toolkit/core/settings/settings";
import { getBrowser } from "toolkit/core/common/browser";

const storage = new ExtensionStorage();

function sendToolkitBootstrapMessage(userSettings) {
  window.postMessage({
    type: InboundMessageType.Bootstrap,
    settings: userSettings,
  }, '*');
}

function onToolkitMessage(event) {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case OutboundMessageType.ToolkitLoaded:
        initalizeToolkit();
        break;
    }
  }
}

function handleSetFeatureSettings({ name, value }) {
  storage.setItem(name, value);
}

function onFeatureSettingsChange(name, value) {
  window.postMessage({
    type: InboundMessageType.SettingChanged,
    settings: {
      name: name,
      value: value
    }
  })
}

function onServiceWorkerMessage(message, sender, sendResponse) {

  switch (message.type) {
    case InboundMessageType.Navigation: {
      window.postMessage(message);
      break;
    }
  }

  /*switch (message?.action) {
    case 'refresh-dashboard-widgets':
      window.postMessage({
        type: InboundMessageType.RefreshDashboardWidgets
      });
      break;
  }*/
}

async function initalizeToolkit() {
  const userSettings = await getUserSettings();
  sendToolkitBootstrapMessage(userSettings);
}

async function init() {

  const script = document.createElement('script');
  script.id = 'mm-toolkit';
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.runtime.getURL('web-accessibles/mm-toolkit.js'));
  document.getElementsByTagName('head')[0].appendChild(script);

  window.addEventListener('message', onToolkitMessage);

  for (const setting of allSettingsLut) {
    storage.onStorageItemChanged(setting.name, onFeatureSettingsChange);
  }

  const { runtime } = getBrowser();
  runtime.onMessage.addListener(onServiceWorkerMessage);
}

init();