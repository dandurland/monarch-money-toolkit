
import initSentry from "./initSentry";
import { InboundMessageType, OutboundMessageType } from 'toolkit/messages';
import { getBrowser } from "toolkit/core/common/browser";
import { ExtensionStorage } from "toolkit/core/common/storage";
import makePersistRoot from "toolkit/common/monarch/make-persist-root";
import { AuthProvider } from "./auth-provider";
import { PersistRoot } from "toolkit/common/monarch/persist-root";
import { isNil, isNotNil } from "toolkit/common/uitilities/isNil";
import { AuthStatus } from "toolkit/core/common/storage/models";

const HOST_NAME = 'app.monarchmoney.com';

export class ServiceWorker {

  storage = new ExtensionStorage();
  private browser = chrome;
  private authProvider = new AuthProvider();

  constructor() {

    this.browser = getBrowser();
    initSentry();
  }

  initalize() {
    this.browser.runtime.onMessage.addListener(this.onMessage);
    this.browser.tabs.onUpdated.addListener(this.onTabUpdated);
  }

  private onMessage = (message : any, sender : any, sendResponse : any) => {
    switch (message.type) {
      case OutboundMessageType.OpenOptionsPage: {
        this.browser.runtime.openOptionsPage();
        break;
      }
      default:
        console.log('unknown message', message);
    }
  }

  private onTabUpdated = async (tabId : any, changeInfo : any, tab : any) => {
    if (tab?.url?.startsWith('chrome://')) {
      return;
    }

    const isChangeInfo = isNotNil(changeInfo.url);
    const url = new URL(isChangeInfo ? changeInfo.url : tab.url);
    if(url.hostname !== HOST_NAME){
      return;
    }

    if(isChangeInfo) {
      if (url.search === "") {
        //notify toolkit of in-app root navigation
        const message = {
          type: InboundMessageType.Navigation,
          pathname: url.pathname
        };
  
        const persistRoot = await this.getPersistRootFromCurrentTab(tabId);
        const result = await this.authProvider.updateAuthInfo(persistRoot.user.token);
        if(result !== AuthStatus.Success) {
          console.log('Error getting AuthStatus');
        }

        this.browser.tabs.sendMessage(tabId, message);
      }

      return;
    }

    if(url.pathname !== '/dashboard' || changeInfo.status !== 'loading') {
      return;
    }

    const persistRoot = await this.getPersistRootFromCurrentTab(tabId);
    const result = await this.authProvider.updateAuthInfo(persistRoot.user.token);
    if(result !== AuthStatus.Success) {
      console.log('Error getting AuthStatus');
    }

    //notify toolkit of initial app launch to dashboard
    const message = {
      type: InboundMessageType.Navigation,
      pathname: url.pathname
    };

    this.browser.tabs.sendMessage(tabId, message);
  }

  private async getPersistRootFromCurrentTab(tabId : any) : Promise<PersistRoot> {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => localStorage['persist:root'],
    });

    return makePersistRoot(result[0].result);
  };
}

