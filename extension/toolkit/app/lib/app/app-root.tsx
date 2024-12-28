import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMonarchAuthToken } from '@extension/monarch';
import { features } from '@extension/features';
import { ThemeProvider } from './theme-provider';
import { PortalFeature } from '@extension/shared';
import '@extension/ui/dist/global.css';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export default function AppRoot() {
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

  const portals = features.featureInstances.filter(f => f instanceof PortalFeature);

  return (
    <>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <Outlet />
          {portals && <>{portals.map(p => p.getPortal())}</>}
        </ThemeProvider>
      </ApolloProvider>
      <TanStackRouterDevtools />
    </>
  );
}
