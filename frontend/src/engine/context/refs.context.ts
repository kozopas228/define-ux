import React, { createContext } from 'react';

export type refsContextType = {
    wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
    divRef: React.MutableRefObject<HTMLDivElement | null>;
};
export const RefsContext = createContext<refsContextType | null>(null);
