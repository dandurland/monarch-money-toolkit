import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { toolkitEnabledStorage } from '@extension/storage';
import { Switch } from '@extension/ui';
import { Button } from '@extension/ui';

const Popup = () => {
  const { enabled } = useStorage(toolkitEnabledStorage);
  const logo = 'popup/logo.svg';
  const goGithub = () => chrome.tabs.create({ url: 'https://github.com/dandurland/monarch-money-toolkit' });
  const goSettings = () => chrome.runtime.openOptionsPage();

  async function toggleExtension(e: any) {
    await toolkitEnabledStorage.toggleEnabled();
  }

  return (
    <div className="absolute bottom-0 top-0 left-0 right-0 text-center h-full p-4">
      <div className="h-full flex flex-col items-center justify-end">
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
