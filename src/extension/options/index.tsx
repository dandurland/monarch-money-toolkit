import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Options } from './component/component';
import { getUserSettings } from '../../core/settings';
import { toolkitStorage } from '../../core/common/storage';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMonarchAuthToken } from '../../core/utilities/monarchSettings';

getUserSettings().then(async (settings) => {

  const theme = await toolkitStorage.getItem('theme');

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

  document.querySelector('html')!.dataset['theme'] = theme;

  const root = createRoot(document.getElementById('root')!);

  root.render(
    <ApolloProvider client={client}>
      <Options settings={settings} />
    </ApolloProvider>
  );
});