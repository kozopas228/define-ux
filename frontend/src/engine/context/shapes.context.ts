import { Shape } from '../types/Shape';
import React, { createContext } from 'react';

export type shapesContextType = {
    shapes: Shape[];
    setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
};

export const ShapesContext = createContext<shapesContextType | null>(null);
