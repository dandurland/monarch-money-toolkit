export enum OutboundMessageType {
  ToolkitLoaded = 'mmtk-loaded',
  OpenOptionsPage = 'mmtk-open-options'
}

export enum InboundMessageType {
  Bootstrap = 'mmtk-bootstrap',
  SettingChanged = 'mmtk-setting-changed',
  Navigation = 'mmtk-navigation',
}

export type BootstrapMessage = MessageEvent<{
  type: InboundMessageType.Bootstrap;
  settings: any;
}>;

export type SettingChangedMessage = MessageEvent<{
  type: InboundMessageType.SettingChanged;
  settings: {
    name: string;
    value: any;
  }
}>;

export type NavigationMessage = MessageEvent<{
  type: InboundMessageType.Navigation;
  pathname: string;
}>;

export type InboundMessage = BootstrapMessage
  | SettingChangedMessage
  | NavigationMessage;