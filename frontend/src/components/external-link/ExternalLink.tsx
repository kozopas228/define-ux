import React from 'react';
import styles from './ExternalLink.module.css';
import ExternalLinkIcon from '../../assets/icons/external-link.svg';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    onClick?: any;
    href?: string;
}

const ExternalLink = ({
    children,
    className,
    style,
    onClick,
    href,
}: IProps) => {
    return (
        <span className={styles['external_link']}>
            <a
                className={'text-big-bold color-blue-700'}
                href={href}
                target={'_blank'}
                rel='noreferrer'>
                {children}
            </a>
            <ExternalLinkIcon />
        </span>
    );
};

export default ExternalLink;
