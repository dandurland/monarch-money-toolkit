/* eslint-disable */
import { useEffect, useState } from 'react';

const useMountTransition = (isMounted: boolean, unmountDelay: number) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timeoutId: any;

    if (isMounted && !isTransitioning) {
      setIsTransitioning(true);
    } else if (!isMounted && isTransitioning) {
      timeoutId = setTimeout(() => setIsTransitioning(false), unmountDelay);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [unmountDelay, isMounted, isTransitioning]);

  return isTransitioning;
};

export default useMountTransition;
