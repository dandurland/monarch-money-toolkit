export enum InboundMessageType {
  Bootstrap = 'mmtk-bootstrap',
  SettingChanged = 'mmtk-setting-changed',
  Navigation = 'mmtk-navigation',
  Mutation = 'mmtk-mutation',
}

export interface BootstrapMessage {
  type: InboundMessageType.Bootstrap;
  settings: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type BootstrapMessageEvent = MessageEvent<BootstrapMessage>;

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

export type InboundMessage = BootstrapMessage | SettingChangedMessage | NavigationMessage | MutationMessage;
export type InboundMessageEvent = BootstrapMessageEvent | SettingChangedMessageEvent | NavigationMessageEvent;

export enum OutboundMessageType {
  ToolkitLoaded = 'mmtk-loaded',
  OpenOptionsPage = 'mmtk-open-options',
  ToolkitError = 'mmtk-toolkit-error',
}

export type ToolkitLoadedMesssage = MessageEvent<{
  type: OutboundMessageType.ToolkitLoaded;
}>;

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

export type OutboundMessage = ToolkitLoadedMesssage | OpenOptionsPageMesssage | ToolkitErrorMesssage;
