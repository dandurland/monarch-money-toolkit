import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { toolkitEnabledStorage } from '@extension/storage';
import { Switch, Button } from '@extension/ui';

const Popup = () => {
  const { enabled } = useStorage(toolkitEnabledStorage);
  const logo = 'popup/logo.svg';
  const goGithub = () => chrome.tabs.create({ url: 'https://github.com/dandurland/monarch-money-toolkit' });
  const goSettings = () => chrome.runtime.openOptionsPage();

  async function toggleExtension() {
    await toolkitEnabledStorage.toggleEnabled();
  }

  return (
    <div className="absolute inset-0 h-full p-4 text-center">
      <div className="flex h-full flex-col items-center justify-end">
        <button onClick={goGithub}>
          <img src={chrome.runtime.getURL(logo)} className="h-[50vmin]" alt="logo" />
        </button>
        <div className="flex flex-row items-center">
          <label
            className="p-2 text-sm font-semibold"
            htmlFor="extension-enabled">{`${enabled ? 'Disable' : 'Enable'} Toolkit`}</label>
          <Switch id="extension-enabled" checked={enabled} onCheckedChange={toggleExtension} />
        </div>
        <Button onClick={goSettings}>Open Settings</Button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
