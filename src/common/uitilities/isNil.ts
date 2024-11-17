/*import * as R from 'ramda';
export const isNotNil = <T>(val: T | null | undefined): boolean => R.complement(R.isNil)(val);*/

// Check if a value is not null or undefined
export const isNil = <T>(val: T | null | undefined): boolean => (val == null);
export const isNotNil = <T>(val: T | null | undefined): boolean => !(isNil(val));