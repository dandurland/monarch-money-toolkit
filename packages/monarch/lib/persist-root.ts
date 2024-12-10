export interface PersistRootUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface PersistUI {
  themePreference: string;
}

export interface Persist {
  version: string;
}

export interface PersistRoot {
  user: PersistRootUser;
  persistentUi?: PersistUI;
  _persist?: Persist;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makePersistRoot(value: any): PersistRoot {
  const json = JSON.parse(value);
  const root: PersistRoot = {
    user: JSON.parse(json.user),
    persistentUi: JSON.parse(json.persistentUi),
    _persist: JSON.parse(json._persist),
  };

  return root;
}
