import { useRef } from 'react';

/**
 * This hook allows you to keep track of the initial value of a variable.
 * It is useful if you want to track if a variable has changed or not.
 * https://www.whatthehooks.com/use-initial-value
 */
const useInitialValue = <T>(value: T) => {
  const initialValue = useRef(value);
  return initialValue.current;
};

export default useInitialValue;