import React from 'react';
import styles from './Alert.module.css';
import Cross from '../../assets/icons/cross.svg';
import { ALERT_ACTIVE_TIME } from '../../utils/constants';

interface IProps {
    isActive: boolean;
    setIsActive: any;
    children: React.ReactNode;
    className?: string;
}

const AlertDanger = ({
    children,
    isActive,
    setIsActive,
    className,
}: IProps) => {
    if (isActive) {
        setTimeout(() => {
            setIsActive(false);
        }, ALERT_ACTIVE_TIME);
    }

    return (
        <div
            className={`${styles['alert']} ${styles['alert_danger']} ${
                isActive ? styles['active'] : ''
            } ${className}`}>
            <div className={styles['icon']}>
                <Cross />
            </div>
            <p className={'text-normal color-dark-900'}>{children}</p>
        </div>
    );
};

export default AlertDanger;
