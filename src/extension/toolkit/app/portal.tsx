import { useEffect } from "react";
import { createPortal } from "react-dom";

export function Portal({ mount, children }: { mount: any, children: any }) {

  const el = document.createElement("div");

  useEffect(() => {
    mount?.appendChild(el);
    return function () { mount?.removeChild(el); };
  }, [el, mount]);

  return createPortal(children, el);
}

export default Portal;