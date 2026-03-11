import React, { createContext } from 'react';
import { Arrow } from '../types/Arrow';
import { Point } from '../types/Point';
import { ArrowType } from '../types/ArrowType';
import { UUID } from '../types/Uuid';

export type arrowsContextType = {
    arrows: Arrow[];
    setArrows: React.Dispatch<React.SetStateAction<Arrow[]>>;
    isArrowing: boolean;
    setIsArrowing: React.Dispatch<React.SetStateAction<boolean>>;
    arrowType: ArrowType | null;
    setArrowType: React.Dispatch<React.SetStateAction<ArrowType>>;
    setArrowingStartPoint: React.Dispatch<React.SetStateAction<Point>>;
    setArrowingStartShapeId: React.Dispatch<React.SetStateAction<UUID | null>>;
    setArrowingFinishPoint: React.Dispatch<React.SetStateAction<Point>>;
    setArrowingFinishShapeId: React.Dispatch<React.SetStateAction<UUID | null>>;
};

export const ArrowsContext = createContext<arrowsContextType | null>(null);
