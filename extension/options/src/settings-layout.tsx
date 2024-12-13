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
    href: '/',
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
  const logo = 'options/logo_horizontal.svg';
  const goGithub = () => chrome.tabs.create({ url: 'https://github.com/dandurland/monarch-money-toolkit' });

  async function toggleExtension() {
    await toolkitEnabledStorage.toggleEnabled();
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex flex-row items-center">
          <div className="flex h-full flex-row items-center justify-end">
            <button onClick={goGithub}>
              <img src={chrome.runtime.getURL(logo)} className="h-[20vmin]" alt="logo" />
            </button>
            <div className="flex flex-row items-center">
              <Switch id="extension-enabled" checked={enabled} onCheckedChange={toggleExtension} />
              <label
                className="p-2 text-sm font-semibold"
                htmlFor="extension-enabled">{`${enabled ? 'Disable' : 'Enable'} Toolkit`}</label>
            </div>
          </div>
          <div className="grow space-y-0.5"></div>
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
