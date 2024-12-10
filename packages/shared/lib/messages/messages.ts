export enum InboundMessageType {
  Bootstrap = 'mmtk-bootstrap',
  SettingChanged = 'mmtk-setting-changed',
  Navigation = 'mmtk-navigation',
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
}

export type NavigationMessageEvent = MessageEvent<NavigationMessage>;

export type InboundMessage = BootstrapMessage | SettingChangedMessage | NavigationMessage;
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
