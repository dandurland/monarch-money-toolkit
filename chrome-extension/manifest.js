import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = deepmerge(
  {
    manifest_version: 3,
    default_locale: 'en',
    /**
     * if you want to support multiple languages, you can use the following reference
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
     */
    name: '__MSG_extensionName__',
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    host_permissions: ['*://*.monarchmoney.com/*'],
    permissions: ['storage', 'scripting', 'tabs', 'notifications', 'webRequest'],
    options_page: 'options/index.html',
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    action: {
      default_popup: 'popup/index.html',
      default_icon: 'icon-34.png',
    },
    icons: {
      128: 'icon-128.png',
    },
    content_scripts: [
      {
        matches: ['*://*.monarchmoney.com/*'],
        js: ['toolkit-bridge/index.iife.js'],
        css: ['toolkit-bridge/style.css'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['toolkit/*', '*.js', '*.map', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
        matches: ['*://*.monarchmoney.com/*'],
      },
    ],
  },
  false,
);

export default manifest;
