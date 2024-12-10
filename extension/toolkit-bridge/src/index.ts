import { toolkitEnabledStorage } from '@extension/storage';
import type { BootstrapMessage, InboundMessage, OutboundMessage } from '@extension/shared';
import { InboundMessageType, OutboundMessageType } from '@extension/shared';
import { ToolkitApp } from '@extension/toolkit-app';
import { features } from '@extension/features';
import '@extension/ui/dist/global.css';

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
      case OutboundMessageType.ToolkitLoaded: {
        bootstrapToolkit();
        break;
      }
      case OutboundMessageType.OpenOptionsPage: {
        //chrome.runtime.openOptionsPage();
        chrome.runtime.sendMessage(OutboundMessageType.OpenOptionsPage);
        break;
      }
    }
  }
}

async function mountApp() {
  app.mount();

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
  console.log(message);
  switch (message.type) {
    case InboundMessageType.Navigation: {
      app.navigate(message.pathname);
      //window.postMessage(message, '*');
      break;
    }
  }
}

async function bootstrapToolkit(): Promise<void> {
  window.postMessage(
    {
      type: InboundMessageType.Bootstrap,
      settings: 'test',
    } as BootstrapMessage,
    '*',
  );
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
