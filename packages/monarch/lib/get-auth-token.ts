import { isNil } from '@extension/core';
import { makePersistRoot } from './persist-root';

export function getMonarchAuthToken(): string | null {
  const json = localStorage.getItem('persist:root');
  if (isNil(json)) {
    return null;
  }
  const root = makePersistRoot(json);
  return root.user?.token;
}
