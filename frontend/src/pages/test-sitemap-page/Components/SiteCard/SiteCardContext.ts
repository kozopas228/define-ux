import { createContext } from 'react';

type SiteCardContextType = {
    isActive: boolean;
};

const SiteCardContext = createContext<SiteCardContextType | null>(null);

export default SiteCardContext;
