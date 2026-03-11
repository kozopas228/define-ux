import React, { createContext, useState } from 'react';
import { ResizingDirection } from '../types/ResizingDirection';
import { Point } from '../types/Point';
import { UUID } from '../types/Uuid';

export type resizingContextType = {
    setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
    setResizingDirection: React.Dispatch<
        React.SetStateAction<ResizingDirection | null>
    >;
    setResizingShapeId: React.Dispatch<React.SetStateAction<UUID | null>>;
    setResizingPoint: React.Dispatch<React.SetStateAction<Point | null>>;
};
export const ResizingContext = createContext<resizingContextType | null>(null);
