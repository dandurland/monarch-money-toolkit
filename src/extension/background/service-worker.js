
import * as Sentry from "@sentry/react";
import { InboundMessageType, OutboundMessageType } from 'toolkit/messages';
import { getBrowser } from "toolkit/core/common/browser";
import { ExtensionStorage } from "toolkit/core/common/storage";
import { AuthStatus } from "toolkit/core/common/storage/models";

const AUTH_EXPIRATION = 1000 * 60 * 60 * 24 * 7; //7 days
const AUTH_INFO_KEY = 'auth-info';
const HOST_NAME = 'app.monarchmoney.com';

export class ServiceWorker {

  storage = new ExtensionStorage();
  browser = chrome;

  constructor() {

    this.browser = getBrowser();
    this.initSentry();
  }

  initalizeListeners() {
    this.browser.runtime.onMessage.addListener(this.onMessage);
    this.browser.tabs.onUpdated.addListener(this.onTabUpdated);
  }

  onMessage = (message, sender, sendResponse) => {
    switch (message.type) {
      case OutboundMessageType.OpenOptionsPage: {
        this.browser.runtime.openOptionsPage();
        break;
      }
      default:
        console.log('unknown message', message);
    }
  }

  onTabUpdated = async (tabId, changeInfo, tab) => {
    if (tab?.url?.startsWith('chrome://')) {
      return;
    }

    if (changeInfo.url) {
      return this.handleChangeInfoUrl(tabId, changeInfo.url);
    }

    this.handleTabUrl(tabId, tab.url, changeInfo);
  }

  async handleChangeInfoUrl(tabId, changeInfoUrl) {

    const url = new URL(changeInfoUrl);

    if(url.hostname !== HOST_NAME)
    {
      return;
    }

    if (url.search === "") {
      //notify toolkit of in-app root navigation
      const message = {
        type: InboundMessageType.Navigation,
        pathname: url.pathname
      };

      this.browser.tabs.sendMessage(tabId, message);
    }

    await this.updateAuthInfo(tabId);
  }

  handleTabUrl(tabId, tabUrl, changeInfo) {
    const url = new URL(tabUrl);

    if(url.hostname !== HOST_NAME || url.pathname !== '/dashboard' || changeInfo.status !== 'loading') {
      return;
    }

    //notify toolkit of initial app launch to dashboard
    const message = {
      type: InboundMessageType.Navigation,
      pathname: url.pathname
    };

    this.browser.tabs.sendMessage(tabId, message);
  }

  async getAuthTokenFromCurrentTab(tabId) {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => localStorage['persist:root'],
    });

    return JSON.parse(JSON.parse(result[0].result).user).token;
  };

  updateAuthInfo = async (tabId) => {

    const authInfo = await this.storage.getItem(AUTH_INFO_KEY);
    const lastAuth = new Date(authInfo?.lastAuth ?? 0);

    const currentToken = await this.getAuthTokenFromCurrentTab(tabId);

    if (authInfo?.token === currentToken
      && authInfo?.status === AuthStatus.Success
      && lastAuth >= new Date(Date.now() - AUTH_EXPIRATION)) {
      return;
    }
 
    try {
      
      if (currentToken) {
        await this.storage.setItem(AUTH_INFO_KEY,
          {
            token: currentToken,
            lastAuth: Date.now(),
            status: AuthStatus.Success
          });
      } else {
        await this.storage.setItem(AUTH_INFO_KEY,
          {
            token: null,
            lastAuth: new Date(0),
            status: AuthStatus.NotLoggedIn
          });
      }
    } catch (e) {
      await this.storage.setItem(AUTH_INFO_KEY,
        {
          token: null,
          lastAuth: new Date(0),
          status: AuthStatus.Failure
        });
    }
  };

  initSentry() {

    Sentry.WINDOW.document = {
      visibilityState: 'hidden',
      addEventListener: () => { },
    };

    Sentry.init({
      dsn: "https://a1212f655f32934621ad0295c4df6d97@o4506972874866688.ingest.us.sentry.io/4506972877750272",
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      // Session Replay
      replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }
}
