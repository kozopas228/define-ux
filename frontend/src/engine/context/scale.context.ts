import { createContext } from 'react';

export type scaleContextType = {
    scale: number;
};
export const ScaleContext = createContext<scaleContextType | null>(null);
