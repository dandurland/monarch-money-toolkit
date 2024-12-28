import 'webextension-polyfill';
import { isNil, isNotNil } from '@extension/core';
import type { GraphQLRequest, MutationMessage, NavigationMessage } from '@extension/shared';
import { InboundMessageType, OutboundMessageType } from '@extension/shared';
import type { PersistRoot } from '@extension/monarch';
import { makePersistRoot } from '@extension/monarch';
import { AuthProvider } from './auth-provider';
import { AuthStatus } from '@extension/storage';
import scope from './init-sentry';
import TTLCache from '@isaacs/ttlcache';

const HOST_NAME = 'app.monarchmoney.com';
const REQUEST_URL_FILTER = ['*://*.monarchmoney.com/graphql'];

function getMutationMessage(request?: GraphQLRequest): MutationMessage | undefined {
  switch (request?.operationName) {
    case 'Web_UpdateTransactionOverview': {
      return {
        type: InboundMessageType.Mutation,
        request: {
          type: 'update-transaction-overview',
          variables: {
            categoryId: request.variables.input.category,
            transactionId: request.variables.input.id,
          },
        },
      };
    }
    default:
      return undefined;
  }
}

async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const requestCache = new TTLCache<string, MutationMessage>({ max: 10, ttl: 5000 });

export class ServiceWorker {
  private authProvider = new AuthProvider();

  initalize() {
    chrome.runtime.onMessage.addListener(this.onMessage);
    chrome.tabs.onUpdated.addListener(this.onTabUpdated);
    chrome.runtime.onInstalled.addListener(this.onInstalled);

    chrome.webRequest.onBeforeRequest.addListener(this.onBeforeRequest, { urls: REQUEST_URL_FILTER }, ['requestBody']);

    chrome.webRequest.onCompleted.addListener(this.onCompletedRequest, { urls: REQUEST_URL_FILTER }, [
      'responseHeaders',
    ]);
  }

  private onInstalled = async () => {
    try {
      const manifest = chrome.runtime.getManifest();

      if (isNil(manifest) || isNil(manifest.content_scripts)) {
        return;
      }

      let monarchTabId = -1;
      for (const cs of manifest!.content_scripts!) {
        for (const tab of await chrome.tabs.query({ url: cs.matches })) {
          if (tab.url?.match(/(chrome|chrome-extension):\/\//gi)) {
            continue;
          }

          if (monarchTabId === -1 && tab.id) {
            monarchTabId = tab.id;
          }

          const target = { tabId: tab.id!, allFrames: cs.all_frames! };

          if (!isNil(cs.js)) {
            chrome.scripting.executeScript({
              files: cs.js!,
              target,
            });
          }

          if (!isNil(cs.css)) {
            chrome.scripting.insertCSS({
              files: cs.css,
              target,
            });
          }
        }
      }

      if (monarchTabId === -1) {
        return;
      }

      const persistRoot = await this.getPersistRootFromCurrentTab(monarchTabId);
      const result = await this.authProvider.updateAuthInfo(persistRoot.user.token);
      if (result !== AuthStatus.Success) {
        console.log('Error getting AuthStatus');
      }
    } catch (e) {
      scope.captureException(e);
    }
  };

  private onBeforeRequest(details: chrome.webRequest.WebRequestBodyDetails) {
    if (details.method !== 'POST' || isNil(details.requestBody?.raw)) {
      return;
    }

    const bytes = details.requestBody?.raw![0]?.bytes;
    if (isNil(bytes) || bytes?.byteLength === 0) {
      return;
    }

    try {
      const json = new TextDecoder('utf-8').decode(bytes);
      const request = JSON.parse(json) as GraphQLRequest;

      const message = getMutationMessage(request);
      if (isNil(message)) {
        return;
      }

      requestCache.set(details.requestId, message!);
    } catch (error) {
      console.log(`Error parsing request body: ${error}`);
    }
  }

  private onCompletedRequest(details: chrome.webRequest.WebResponseCacheDetails) {
    if (!requestCache.has(details.requestId)) {
      return;
    }

    const message = requestCache.get(details.requestId);
    requestCache.delete(details?.requestId);

    if (isNil(message) || details.statusCode !== 200) {
      return;
    }

    getCurrentTab().then(tab => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onMessage = (message: any) => {
    console.log(message);
    switch (message?.type) {
      case OutboundMessageType.OpenOptionsPage: {
        chrome.runtime.openOptionsPage();
        break;
      }
      case OutboundMessageType.ToolkitError: {
        this.handleException(message.context);
        break;
      }
      default:
        console.log('unknown message', message);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onTabUpdated = async (tabId: any, changeInfo: any, tab: any) => {
    if (tab?.url?.startsWith('chrome://')) {
      return;
    }

    const isChangeInfo = isNotNil(changeInfo.url);
    if (!isChangeInfo && isNil(tab.url)) {
      console.log('tab change urls are all null');
      return;
    }

    const url = new URL(isChangeInfo ? changeInfo.url : tab.url);
    if (url.hostname !== HOST_NAME) {
      return;
    }

    if (isChangeInfo) {
      const message: NavigationMessage = {
        type: InboundMessageType.Navigation,
        pathname: url.pathname,
        searchPath: url.search,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const persistRoot = await this.getPersistRootFromCurrentTab(tabId);
      const result = await this.authProvider.updateAuthInfo(persistRoot.user.token);
      if (result !== AuthStatus.Success) {
        console.log('Error getting AuthStatus');
      }

      chrome.tabs.sendMessage(tabId, message);

      return;
    }

    if (url.pathname !== '/dashboard' || changeInfo.status !== 'loading') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const persistRoot = await this.getPersistRootFromCurrentTab(tabId);
    const result = await this.authProvider.updateAuthInfo(persistRoot.user.token);
    if (result !== AuthStatus.Success) {
      console.log('Error getting AuthStatus');
    }

    //notify toolkit of initial app launch to dashboard
    const message: NavigationMessage = {
      type: InboundMessageType.Navigation,
      pathname: url.pathname,
    };

    chrome.tabs.sendMessage(tabId, message);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getPersistRootFromCurrentTab(tabId: any): Promise<PersistRoot> {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => localStorage['persist:root'],
    });

    return makePersistRoot(result[0].result);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleException = (context: any) => {
    scope.captureException(new Error(context.serializedError), {
      captureContext: {
        tags: {
          featureName: context.featureName,
        },
        extra: {
          featureSetting: context.featureSetting,
          functionName: context.functionName,
          routeName: context.routeName,
        },
      },
    });
  };
}
