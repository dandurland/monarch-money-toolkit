import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMonarchAuthToken } from '@extension/monarch';
import { ThemeProvider } from './theme-provider';
import '@extension/ui/dist/global.css';
import { Outlet } from '@tanstack/react-router';
import { PortalMount } from './portal-mount';

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

  return (
    <>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <Outlet />
          <PortalMount />
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}
