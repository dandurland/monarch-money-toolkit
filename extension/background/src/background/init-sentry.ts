import { BrowserClient, defaultStackParser, getDefaultIntegrations, makeFetchTransport, Scope } from '@sentry/browser';

const integrations = getDefaultIntegrations({}).filter(defaultIntegration => {
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(defaultIntegration.name);
});

const client = new BrowserClient({
  dsn: 'https://a1212f655f32934621ad0295c4df6d97@o4506972874866688.ingest.us.sentry.io/4506972877750272',
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations,
});

const scope = new Scope();
scope.setClient(client);
client.init();

export default scope;
