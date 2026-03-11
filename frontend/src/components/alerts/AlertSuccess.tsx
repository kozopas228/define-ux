import React from 'react';
import styles from './Alert.module.css';
import Tick from '../../assets/icons/tick.svg';
import { ALERT_ACTIVE_TIME } from '../../utils/constants';

interface IProps {
    isActive: boolean;
    setIsActive: any;
    children: React.ReactNode;
    className?: string;
}

const AlertSuccess = ({
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
            className={`${styles['alert']} ${styles['alert_success']} ${
                isActive ? styles['active'] : ''
            } ${className}`}>
            <div className={styles['icon']}>
                <Tick />
            </div>
            <p className={'text-normal color-dark-900'}>{children}</p>
        </div>
    );
};

export default AlertSuccess;
