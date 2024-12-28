import { useSyncExternalStore } from 'react';
import type { BaseStorage } from '@extension/storage';
import { wrapPromise } from '@extension/core';

type WrappedPromise = ReturnType<typeof wrapPromise>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storageMap: Map<BaseStorage<any>, WrappedPromise> = new Map();

export function useStorage<
  Storage extends BaseStorage<Data>,
  Data = Storage extends BaseStorage<infer Data> ? Data : unknown,
>(storage: Storage) {
  const _data = useSyncExternalStore<Data | null>(storage.subscribe, storage.getSnapshot);

  if (!storageMap.has(storage)) {
    storageMap.set(storage, wrapPromise(storage.get()));
  }
  if (_data !== null) {
    storageMap.set(storage, { read: () => _data });
  }

  return (_data ?? storageMap.get(storage)!.read()) as Exclude<Data, PromiseLike<unknown>>;
}
