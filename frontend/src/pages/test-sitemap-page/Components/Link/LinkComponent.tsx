import React, { useContext } from 'react';
import styles from './LinkComponent.module.css';
import { LinkType } from '../../types/LinkType';
import SiteCardContext from '../SiteCard/SiteCardContext';

interface IProps {
    type: LinkType;
    children: React.ReactNode;
}

const LinkComponent = ({ type, children }: IProps) => {
    let linkClassType: string;

    switch (type) {
        case LinkType.PageContent: {
            linkClassType = 'type-page-content';
            break;
        }
        case LinkType.Internal: {
            linkClassType = 'type-internal';
            break;
        }
        case LinkType.LoginOrRegister: {
            linkClassType = 'type-login-or-register';
            break;
        }
        case LinkType.ExternalLink: {
            linkClassType = 'type-external';
            break;
        }
        case LinkType.PayedStuff: {
            linkClassType = 'type-payed-stuff';
            break;
        }
    }

    const siteCardContext = useContext(SiteCardContext)!;

    const isActive = siteCardContext.isActive;

    return (
        <div
            className={[
                styles['link'],
                isActive && styles['active'],
                styles[linkClassType],
            ].join(' ')}>
            {children}
        </div>
    );
};

export default LinkComponent;
