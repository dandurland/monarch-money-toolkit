import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMonarchAuthToken } from 'toolkit/core/utilities/monarchSettings';
import { Outlet } from 'react-router-dom';
import { UserSettingsProvider } from 'toolkit/extension/providers/user-settings-provider';

export default function Root() {
  const httpLink = createHttpLink({
    uri: 'https://api.monarchmoney.com/graphql',
  });

  const authLink = setContext(async (_, { headers }) => {
    return getMonarchAuthToken()
      .then((token) => {
        return {
          headers: {
            ...headers,
            authorization: `Token ${token}`,
          }
        }
      });
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <>
      <UserSettingsProvider>
        <ApolloProvider client={client}>
          <Outlet />
        </ApolloProvider>
      </UserSettingsProvider>
    </>
  );
}