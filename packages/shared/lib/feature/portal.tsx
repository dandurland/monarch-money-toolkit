import { useRef } from 'react';
import { createPortal } from 'react-dom';

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
