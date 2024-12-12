/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MutationMessage, GraphQLRequest } from '../messages';
import { InboundMessageType } from '../messages';
import { createContext, useContext, useState } from 'react';

function inboundMessageListener<T extends InboundMessageType>(message: T, listener: (ev: any) => any) {
  window.addEventListener('message', (event: any) => {
    if (event.data.type === message) {
      listener(event.data);
    }
  });
}

const MutationEventContext = createContext<GraphQLRequest | undefined>(undefined);

export const MutationEventProvider = ({ children }: { children: any }) => {
  const [request, setRequest] = useState<GraphQLRequest | undefined>(undefined);

  inboundMessageListener(InboundMessageType.Mutation, (e: MutationMessage) => {
    setRequest(e.request);
  });

  window.addEventListener('message', (event: any) => {
    switch (event.data.type) {
      case InboundMessageType.Mutation: {
        console.log('app mutation');
        setRequest(event.data.request);
        break;
      }
    }
  });

  return <MutationEventContext.Provider value={request}>{children}</MutationEventContext.Provider>;
};

export const useMutationEvent = () => useContext(MutationEventContext);
