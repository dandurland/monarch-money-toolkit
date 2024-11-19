import * as Sentry from "@sentry/react";

function initSentry() {

  Sentry.WINDOW.document = {
    visibilityState: 'hidden',
    addEventListener: () => { },
  };

  Sentry.init({
    dsn: "https://a1212f655f32934621ad0295c4df6d97@o4506972874866688.ingest.us.sentry.io/4506972877750272",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

export default initSentry;