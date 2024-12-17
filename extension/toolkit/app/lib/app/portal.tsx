import { useRef } from 'react';
import { createPortal } from 'react-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/*export function Portal({ mount, children }: { mount: any; children: any }) {
  const el = document.createElement('div');

  useEffect(() => {
    mount?.appendChild(el);
    return function () {
      mount?.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(children, el);
}*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Portal({ mount, children }: { mount: any; children: any }) {
  const containerRef = useRef(mount);
  /*const el = useRef(document.createElement('div'));

  useEffect(() => {
    containerRef.current?.appendChild(el.current);
    return function () {
      containerRef.current?.removeChild(el.current);
    };
  }, [el, mount]);*/

  return createPortal(children, containerRef.current);
}
