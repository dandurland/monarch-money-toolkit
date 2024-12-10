/* eslint-disable @typescript-eslint/no-explicit-any */
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

export const objectIs: (x: any, y: any) => boolean = typeof Object.is === 'function' ? Object.is : is;
