import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import FocusTrap from "focus-trap-react";
import useMountTransition from "./useMountTransition";
import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

function createPortalRoot() {
  const drawerRoot = document.createElement("div");
  drawerRoot.setAttribute("id", "drawer-root");

  return drawerRoot;
}

export const ANIMATION_DURATION_SECONDS = 0.2;
export const DRAWER_WIDTH_PX = 560;

const SIDE_DRAWER_ROOT_NODE_ID = 'side-drawer-root';

const $Shield = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 40, 100, 0.4);
`;

const $DrawerContainer = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: flex-end;
  position: relative;
`;

const $Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
`;

const $DrawerRoot = styled.div`
  width: ${DRAWER_WIDTH_PX}px;
  height: 100%;
  background-color: white;
`;

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-a-drawer-component-with-react-portals
 */
const SideDrawer = ({
  isOpen,
  children,
  className,
  onClose,
  removeWhenClosed = true
}: {
  isOpen: boolean,
  children: any,
  className?: string,
  onClose: any,
  removeWhenClosed: boolean
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef(document.querySelector("body"));

  const isTransitioning = useMountTransition(isOpen, 300);

  // Allow Escape key to dismiss the drawer
  useEffect(() => {
    const onKeyPress = (e: any) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keyup", onKeyPress);
    }

    return () => {
      window.removeEventListener("keyup", onKeyPress);
    };
  }, [isOpen, onClose]);

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <$Root tabIndex={0} ref={rootRef}>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            transition={{ duration: ANIMATION_DURATION_SECONDS, ease: 'easeOut' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="shield"
          >
            <$Shield onClick={close} />
          </motion.div>
        )}
      </AnimatePresence>
      <$DrawerContainer>
        <AnimatePresence onExitComplete={onClose}>
          {isOpen && (
            <motion.div
              transition={{ duration: ANIMATION_DURATION_SECONDS, ease: 'easeOut' }}
              initial={{ x: DRAWER_WIDTH_PX }}
              animate={{ x: 0 }}
              exit={{ x: DRAWER_WIDTH_PX }}
              key="drawer"
            >
              <$DrawerRoot className={className}>
                {children}
              </$DrawerRoot>
            </motion.div>
          )}
        </AnimatePresence>
      </$DrawerContainer>

    </$Root>,
    document.getElementById(SIDE_DRAWER_ROOT_NODE_ID) as HTMLElement,
  );
};

export default SideDrawer;