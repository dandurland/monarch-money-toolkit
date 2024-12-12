import { useEffect, useState } from 'react';
import type { MutationMessage, MutationRequest } from '../messages';
import { InboundMessageType } from '../messages';
import { isNil } from '@extension/core';

export function useTransactionMutationEvent(
  predicate?: (request: MutationRequest) => boolean,
): MutationRequest | undefined {
  const [data, setData] = useState<MutationRequest>();

  const func = (e: MessageEvent<MutationMessage>) => {
    if (e.data.type !== InboundMessageType.Mutation) {
      return;
    }

    const request = e.data.request;
    if (isNil(request)) {
      return;
    }

    const query = request?.type;
    if (query?.indexOf('transaction') === -1) {
      return;
    }

    if (isNil(predicate) || predicate!(request!)) {
      setData(e.data.request);
    }
  };

  useEffect(() => {
    window.addEventListener('message', func);

    return () => {
      window.removeEventListener('message', func);
    };
  }, [data, func]);

  return data;
}
