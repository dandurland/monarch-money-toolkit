/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(fn: any, time: number) {
  let timeoutId: number | undefined;
  return wrapper;
  function wrapper(...args: any[]) {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      timeoutId = undefined;
      fn(...args);
    }, time);
  }
}
