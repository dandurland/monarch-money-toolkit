import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMonarchAuthToken } from '@extension/monarch';
import { toolkitEnabledStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';
import { Separator, Switch } from '@extension/ui';
import { SidebarNav } from '@src/components/sidebar-nav';
import { Outlet } from 'react-router-dom';

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/options/dashboard',
  },
  {
    title: 'Navigation Bar',
    href: '/options/nav-bar',
  },
  {
    title: 'Transactions',
    href: '/options/transactions',
  },
];

export function SettingsLayout() {
  const httpLink = createHttpLink({
    uri: 'https://api.monarchmoney.com/graphql',
  });

  const token = getMonarchAuthToken();
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Token ${token}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const { enabled } = useStorage(toolkitEnabledStorage);
  const logo = 'popup/logo.svg';
  const goGithub = () => chrome.tabs.create({ url: 'https://github.com/dandurland/monarch-money-toolkit' });

  async function toggleExtension(e: any) {
    await toolkitEnabledStorage.toggleEnabled();
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex flex-row items-center">
          <div className="h-full flex flex-col items-center justify-end">
            <button onClick={goGithub}>
              <img src={chrome.runtime.getURL(logo)} className="h-[20vmin]" alt="logo" />
            </button>
            <div className="flex flex-row items-center">
              <label
                className="p-2 text-sm font-semibold"
                htmlFor="extension-enabled">{`${enabled ? 'Disable' : 'Enable'} Toolkit`}</label>
              <Switch id="extension-enabled" checked={enabled} onCheckedChange={toggleExtension} />
            </div>
          </div>
          <div className="flex-grow space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage Monarch Money Toolkit settings.</p>
          </div>
        </div>

        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 ">
            <ApolloProvider client={client}>
              <Outlet />
            </ApolloProvider>
          </div>
        </div>
      </div>
    </>
  );
}
