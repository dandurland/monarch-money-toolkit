import type { ToolkitErrorMesssage } from '../messages';
import { OutboundMessageType } from '../messages';
import type { Feature } from '../feature';
import type { ErrorInfo } from 'react';
import type { EnabledSettings, EnabledStorage } from '@extension/storage';

export async function withFeatureError(
  wrappedFunction: any /* Function */, // eslint-disable-line @typescript-eslint/no-explicit-any
  feature: Feature<EnabledStorage<EnabledSettings>>,
) {
  if (typeof wrappedFunction !== 'function') {
    throw new Error('The first argument to withToolkitError must be a Function');
  }

  const featureName = feature.featureName;
  const featureSettings = await feature.getSettingsJson();

  return function () {
    try {
      return wrappedFunction();
    } catch (error) {
      logFeatureError({
        error,
        featureName,
        featureSettings,
        functionName: wrappedFunction.name,
      });
    }
  };
}

interface LogFeatureErrorInput {
  error: unknown;
  featureName: string | 'unknown';
  featureSettings: string;
  functionName?: string;
}

export function logFeatureError({ error, featureName, featureSettings, functionName }: LogFeatureErrorInput) {
  const errorMessage = error instanceof Error ? error.message : 'none';
  const errorStack = error instanceof Error ? error.stack : '';

  const routeName = window.location.pathname.replace(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
    'omitted',
  );

  const message = `Feature Error:
  - Feature: ${featureName}
  - Feature Setting: ${featureSettings}
  - Function: ${functionName || 'anonymous'}
  - Message: ${errorMessage}`;

  console.error(message, errorStack || '');

  const serializedError = errorStack ? errorStack.toString() : errorMessage;
  window.postMessage(
    {
      type: 'mmtk-feature-error',
      context: {
        routeName,
        featureName,
        featureSettings,
        functionName,
        serializedError,
      },
    },
    '*',
  );
}

interface LogToolkitErrorInput {
  error: unknown;
  errorInfo?: ErrorInfo;
}

export function logToolkitError({ error, errorInfo }: LogToolkitErrorInput) {
  const errorMessage = error instanceof Error ? error.message : 'none';
  const errorStack = error instanceof Error ? error.stack : '';

  const routeName = window.location.pathname.replace(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
    'omitted',
  );

  const message = `Toolkit Error:
  - ErrorInfo: ${errorInfo?.toString()}
  - Message: ${errorMessage}`;

  console.error(message, errorStack || '');

  const serializedError = errorStack ? errorStack.toString() : errorMessage;
  const serializedErrorInfo = errorInfo?.toString() ?? '';
  const m: ToolkitErrorMesssage['data'] = {
    type: OutboundMessageType.ToolkitError,
    context: {
      routeName,
      serializedErrorInfo,
      serializedError,
    },
  };

  chrome.runtime.sendMessage(m);
}
