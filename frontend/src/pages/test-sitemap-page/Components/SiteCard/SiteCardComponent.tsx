import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './SiteCardComponent.module.css';
import LinkComponent from '../Link/LinkComponent';
import { Link } from '../../types/Link';
import SiteCardContext from './SiteCardContext';
import FooterSvg from './SiteCardPlusFooter.svg';
// import { UxCanvasContext } from '../../../../engine/context/ux-canvas-context';

interface IProps {
    links: Link[];
    heading: string;
    coords: { x: number; y: number };
}

const SiteCardComponent = ({ links, heading, coords }: IProps) => {
    const [isActive, setIsActive] = useState(true);

    // const { toVirtualX, toVirtualY } = useContext(UxCanvasContext)!;
    //
    // return (
    //     <SiteCardContext.Provider
    //         value={{
    //             isActive,
    //         }}>
    //         <div
    //             className={[
    //                 styles['site-card'],
    //                 isActive ? styles['active'] : '',
    //             ].join(' ')}
    //             style={{
    //                 left: toVirtualX(coords.x),
    //                 top: toVirtualY(coords.y),
    //             }}>
    //             <div className={styles['heading']}>{heading}</div>
    //             <div className={styles['content']}>
    //                 {links.map((link: Link) => (
    //                     <LinkComponent
    //                         type={link.type}
    //                         key={link.id}>
    //                         {link.text}
    //                     </LinkComponent>
    //                 ))}
    //             </div>
    //             {isActive && (
    //                 <div className={styles['footer']}>
    //                     <img src={FooterSvg} />
    //                 </div>
    //             )}
    //         </div>
    //     </SiteCardContext.Provider>
    // );
};

export default SiteCardComponent;
