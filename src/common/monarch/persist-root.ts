export interface PersistRootUser {
  id: string,
  name: string,
  email: string,
  token: string,
}

export interface PersistUI {
  themePreference: string,
}

export interface Persist {
  version: string
}

export interface PersistRoot {
  user: PersistRootUser,
  persistentUi?: PersistUI
  _persist?: Persist
}