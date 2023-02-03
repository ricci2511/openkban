import React from 'react';
import { createPortal } from 'react-dom';
import { DragOverlay, UniqueIdentifier } from '@dnd-kit/core';

interface DndDragOverlayProps {
    activeId: UniqueIdentifier | null;
    renderMethod: () => JSX.Element | null;
}
const DndDragOverlay = ({ activeId, renderMethod }: DndDragOverlayProps) => {
    return typeof window !== 'undefined'
        ? createPortal(
              <DragOverlay>{activeId ? renderMethod() : null}</DragOverlay>,
              document.body
          )
        : null;
};

export default DndDragOverlay;
