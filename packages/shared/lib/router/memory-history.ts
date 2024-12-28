import type { HistoryState, HistoryLocation, RouterHistory } from '@tanstack/react-router';
import { createHistory } from '@tanstack/react-router';
import { parseHref, type NavigationBlocker } from '@tanstack/history';

const beforeUnloadEvent = 'beforeunload';

export function createBlockingMemoryHistory(
  opts: {
    initialEntries: Array<string>;
    initialIndex?: number;
    window?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  } = {
    initialEntries: ['/'],
  },
): RouterHistory {
  const win = opts?.window ?? (typeof document !== 'undefined' ? window : (undefined as any)); // eslint-disable-line @typescript-eslint/no-explicit-any

  const entries = opts.initialEntries;
  let index = opts.initialIndex ?? entries.length - 1;
  const states = entries.map(() => ({}) as HistoryState);

  let blockers: Array<NavigationBlocker> = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers: Array<NavigationBlocker>) => (blockers = newBlockers);

  const getLocation = () => parseHref(entries[index]!, states[index]);

  let currentLocation = getLocation();
  let rollbackLocation: HistoryLocation | undefined;
  let ignoreNextBeforeUnload = false;

  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (ignoreNextBeforeUnload) {
      ignoreNextBeforeUnload = false;
      return;
    }

    let shouldBlock = false;

    // If one blocker has a non-disabled beforeUnload, we should block
    const blockers = _getBlockers();
    if (typeof document !== 'undefined' && blockers.length) {
      for (const blocker of blockers) {
        const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
        if (shouldHaveBeforeUnload === true) {
          shouldBlock = true;
          break;
        }

        if (typeof shouldHaveBeforeUnload === 'function' && shouldHaveBeforeUnload() === true) {
          shouldBlock = true;
          break;
        }
      }
    }

    if (shouldBlock) {
      e.preventDefault();
      return (e.returnValue = '');
    }
    return;
  };

  const history = createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      // Removes all subsequent entries after the current index to start a new branch
      if (index < entries.length - 1) {
        entries.splice(index + 1);
        states.splice(index + 1);
      }
      states.push(state);
      entries.push(path);
      index = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index] = state;
      entries[index] = path;
    },
    back: () => {
      ignoreNextBeforeUnload = true;
      index = Math.max(index - 1, 0);
    },
    forward: () => {
      ignoreNextBeforeUnload = true;
      index = Math.min(index + 1, entries.length - 1);
    },
    go: n => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: path => path,
    destroy: () => {
      win.removeEventListener(beforeUnloadEvent, onBeforeUnload, {
        capture: true,
      });
    },
    onBlocked: onUpdate => {
      // If a navigation is blocked, we need to rollback the location
      // that we optimistically updated in memory.
      if (rollbackLocation && currentLocation !== rollbackLocation) {
        currentLocation = rollbackLocation;
        // Notify subscribers
        onUpdate();
      }
    },
    getBlockers: _getBlockers,
    setBlockers: _setBlockers,
  });

  win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });

  return history;
}
