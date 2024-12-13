import $ from 'jquery';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';
import { debounce, isNil } from '@extension/core';

const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true, characterData: true },
  debounceTime: 0,
};

export function useDOMMutationObserver(
  ref: MutableRefObject<HTMLElement | HTMLElement[] | null>,
  callback: MutationCallback,
  options = DEFAULT_OPTIONS,
): void {
  useEffect(() => {
    if (isNil(ref.current)) {
      return () => {};
    }

    const { debounceTime } = options;
    const observer = new MutationObserver(debounceTime > 0 ? debounce(callback, debounceTime) : callback);

    try {
      const { config } = options;
      if (Array.isArray(ref.current)) {
        ref.current.forEach(el => {
          observer.observe(el, config);
        });
      } else {
        observer.observe(ref.current!, config);
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      observer.disconnect();
    };
  }, [callback, options, ref]);
}

const OPTS = {
  properties: [] as string[],
  watchChildren: false,
  debounceTime: 0,
};

export interface ChangeData {
  properties: string[];
  values: Array<string | undefined>;
  originalValues: string[];
}

export interface ChangeResult {
  index: number;
  data: ChangeData;
}

export interface Callback {
  (changes: ChangeData, index: number): void;
}

export function useFilteringDOMMutationObserver(
  ref: MutableRefObject<HTMLElement | HTMLElement[] | null>,
  callback: Callback,
  options = OPTS,
): ChangeResult | undefined {
  const [data, setData] = useState<ChangeResult>();

  useEffect(() => {
    if (isNil(ref.current)) {
      return () => {};
    }

    const data: ChangeData = {
      properties: options.properties,
      values: new Array<string | undefined>(options.properties.length),
      originalValues: options.properties,
    };

    const el$ = $(ref.current!);
    options.properties.forEach((p, i) => {
      const name = p;
      if (name.startsWith('attr_')) data.values[i] = el$.attr(name.replace('attr_', ''));
      else if (name.startsWith('prop_')) data.values[i] = el$.prop(name.replace('props_', ''));
      else data.values[i] = el$.css(name);
    });

    const func: MutationCallback = (/*m: MutationRecord[], obs: MutationObserver*/) => {
      const el$ = $(ref.current!);

      let changed = false;
      let index = 0;
      for (index; index < data.properties.length; index++) {
        const key = data.properties[index];

        let newValue: string | undefined;

        if (key.startsWith('attr_')) newValue = el$.attr(key.replace('attr_', ''));
        else if (key.startsWith('prop_')) newValue = el$.prop(key.replace('prop_', ''));
        else newValue = el$.css(key);

        if (newValue == undefined) continue;

        if (data.values[index] != newValue) {
          data.values[index] = newValue;
          changed = true;
          break;
        }
      }

      if (changed) {
        callback(data, index);
        setData({
          index: 1,
          data: data,
        });
      }
    };

    const { debounceTime } = options;
    const observer = new MutationObserver(debounceTime > 0 ? debounce(callback, debounceTime) : func);

    try {
      if (Array.isArray(ref.current)) {
        ref.current.forEach(el => {
          observer.observe(el, {
            attributes: true,
            characterData: true,
            subtree: options.watchChildren,
            childList: options.watchChildren,
          });
        });
      } else {
        observer.observe(ref.current!, {
          attributes: true,
          characterData: true,
          subtree: options.watchChildren,
          childList: options.watchChildren,
        });
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      observer.disconnect();
    };
  }, [callback, options, ref, data]);

  return data;
}
