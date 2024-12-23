import { HistoryState, HistoryLocation, RouterHistory, createHistory } from '@tanstack/react-router';
import { parseHref, type NavigationBlocker } from '@tanstack/history';

export function createBlockingMemoryHistory(
  opts: {
    initialEntries: Array<string>;
    initialIndex?: number;
  } = {
    initialEntries: ['/'],
  },
): RouterHistory {
  const entries = opts.initialEntries;
  let index = opts.initialIndex ?? entries.length - 1;
  const states = entries.map(() => ({}) as HistoryState);

  let blockers: Array<NavigationBlocker> = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers: Array<NavigationBlocker>) => (blockers = newBlockers);

  const getLocation = () => parseHref(entries[index]!, states[index]);

  let currentLocation = getLocation();
  let rollbackLocation: HistoryLocation | undefined;
  let skipBlockerNextPop = false;
  let ignoreNextBeforeUnload = false;

  return createHistory({
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
    back: ignoreBlocker => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      index = Math.max(index - 1, 0);
    },
    forward: ignoreBlocker => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      index = Math.min(index + 1, entries.length - 1);
    },
    go: n => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: path => path,
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
}
