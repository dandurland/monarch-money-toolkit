import { createContext, useContext } from 'react';
import type { DraggableProvidedDragHandleProps, DraggableStateSnapshot } from '@hello-pangea/dnd';

export type DraggableContextType = {
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
  state: DraggableStateSnapshot;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DraggableContext = createContext<DraggableContextType>(undefined as any);

export const useDraggableContext = () => {
  const context = useContext(DraggableContext);
  if (!context) {
    throw new Error(
      'useDraggableContext used outside of DraggableContext. Ensure you have a <Draggable> component higher in the tree.',
    );
  }

  return context;
};
