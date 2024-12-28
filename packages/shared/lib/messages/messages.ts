export enum InboundMessageType {
  SettingChanged = 'mmtk-setting-changed',
  Navigation = 'mmtk-navigation',
  Mutation = 'mmtk-mutation',
}

export interface SettingChangedMessage {
  type: InboundMessageType.SettingChanged;
  settings: {
    name: string;
    value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}

export type SettingChangedMessageEvent = MessageEvent<SettingChangedMessage>;

export interface NavigationMessage {
  type: InboundMessageType.Navigation;
  pathname: string;
  searchPath?: string;
}

export type NavigationMessageEvent = MessageEvent<NavigationMessage>;

export interface GraphQLRequest {
  operationName: string;
  query?: string;
  variables: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type TransactionMutation = 'update-transaction-overview';
export type MutationType = TransactionMutation;

export interface MutationRequest {
  type: MutationType;
  variables: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface MutationMessage {
  type: InboundMessageType.Mutation;
  request?: MutationRequest;
}

export type InboundMessage = SettingChangedMessage | NavigationMessage | MutationMessage;
export type InboundMessageEvent = SettingChangedMessageEvent | NavigationMessageEvent;

export enum OutboundMessageType {
  OpenOptionsPage = 'mmtk-open-options',
  ToolkitError = 'mmtk-toolkit-error',
}

export type OpenOptionsPageMesssage = MessageEvent<{
  type: OutboundMessageType.OpenOptionsPage;
}>;

export type ToolkitErrorMesssage = MessageEvent<{
  type: OutboundMessageType.ToolkitError;
  context: {
    routeName: string;
    serializedErrorInfo: string;
    serializedError: string;
  };
}>;

export type OutboundMessage = OpenOptionsPageMesssage | ToolkitErrorMesssage;
