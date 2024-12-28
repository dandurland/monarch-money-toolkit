import '@extension/ui/dist/global.css';
import { toolkitEnabledStorage } from '@extension/storage';
import type { InboundMessage, OutboundMessage } from '@extension/shared';
import { InboundMessageType, OutboundMessageType } from '@extension/shared';
import { ToolkitApp } from '@extension/toolkit-app';
import { features } from '@extension/features';

const app = new ToolkitApp();

async function initalize() {
  toolkitEnabledStorage.subscribe(async () => {
    const { enabled } = await toolkitEnabledStorage.get();
    if (enabled) {
      await mountApp();
      return;
    }

    unmountApp();
  });

  window.addEventListener('message', event => onToolkitMessage(event));
  chrome.runtime.onMessage.addListener(onServiceWorkerMessage);
}

function onToolkitMessage(event: MessageEvent<OutboundMessage>) {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case OutboundMessageType.OpenOptionsPage: {
        chrome.runtime.sendMessage(OutboundMessageType.OpenOptionsPage);
        break;
      }
    }
  }
}

async function mountApp() {
  await app.mount();

  features.featureInstances.forEach(async f => {
    await f.initialize();
  });
}

function unmountApp() {
  app.unmount();

  features.featureInstances.forEach(f => {
    f.destroy();
  });
}

function onServiceWorkerMessage(message: InboundMessage): void {
  switch (message.type) {
    case InboundMessageType.Navigation: {
      app.navigate(message.pathname);
      break;
    }
    case InboundMessageType.Mutation: {
      window.postMessage(message, '*');
      break;
    }
  }
}

//handle extension install/update
function destructor() {
  document.removeEventListener(destructionEvent, destructor);

  app.unmount();
  features.featureInstances.forEach(f => {
    f.destroy();
  });
}

const destructionEvent = 'destruct-mmtk-' + chrome.runtime.id;
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);

initalize().then(() => {});
