import React, { createContext } from 'react';
import { Point } from '../types/Point';

export type draggingContextType = {
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    setDraggingPoint: React.Dispatch<React.SetStateAction<Point | null>>;
};

export const DraggingContext = createContext<draggingContextType | null>(null);
