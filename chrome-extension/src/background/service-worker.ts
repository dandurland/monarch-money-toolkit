import 'webextension-polyfill';
import { isNil, isNotNil } from '@extension/core';
import { InboundMessageType, NavigationMessage, OutboundMessageType } from '@extension/shared';
import { makePersistRoot, PersistRoot } from '@extension/monarch';
import { AuthProvider } from './auth-provider';
import { AuthStatus, ToolkitTheme, toolkitThemeStorage } from '@extension/storage';
import scope from './init-sentry';

const HOST_NAME = 'app.monarchmoney.com';

export class ServiceWorker {
  private authProvider = new AuthProvider();

  initalize() {
    chrome.runtime.onMessage.addListener(this.onMessage);
    chrome.tabs.onUpdated.addListener(this.onTabUpdated);
    chrome.runtime.onInstalled.addListener(this.onInstalled);
  }

  private onInstalled = async () => {
    try {
      const manifest = chrome.runtime.getManifest();

      if (isNil(manifest) || isNil(manifest.content_scripts)) {
        return;
      }
      for (const cs of manifest!.content_scripts!) {
        for (const tab of await chrome.tabs.query({ url: cs.matches })) {
          if (tab.url?.match(/(chrome|chrome-extension):\/\//gi)) {
            continue;
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
    } catch (e) {
      scope.captureException(e);
    }
  };

  private onMessage = (message: any, sender: any, sendResponse: any) => {
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
      if (url.search === '') {
        //notify toolkit of in-app root navigation
        const message: NavigationMessage = {
          type: InboundMessageType.Navigation,
          pathname: url.pathname,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const persistRoot = await this.getPersistRootFromCurrentTab(tabId);

        await this.setTheme(persistRoot);

        const result = await this.authProvider.updateAuthInfo(persistRoot.user.token);
        if (result !== AuthStatus.Success) {
          console.log('Error getting AuthStatus');
        }

        chrome.tabs.sendMessage(tabId, message);
      }

      return;
    }

    if (url.pathname !== '/dashboard' || changeInfo.status !== 'loading') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const persistRoot = await this.getPersistRootFromCurrentTab(tabId);

    await this.setTheme(persistRoot);

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

  private async setTheme(persistRoot: PersistRoot) {
    const theme = persistRoot.persistentUi?.themePreference as ToolkitTheme;
    await toolkitThemeStorage.set(theme ?? 'system');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getPersistRootFromCurrentTab(tabId: any): Promise<PersistRoot> {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => localStorage['persist:root'],
    });

    return makePersistRoot(result[0].result);
  }
}
