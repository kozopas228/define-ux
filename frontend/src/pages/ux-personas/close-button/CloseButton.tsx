import React from 'react';
import styles from './CloseButton.module.css';
import CrossIcon from '../../../assets/icons/cross.svg';

interface IProps {
    handleClick: any;
    className?: string;
}

const CloseButton = ({ handleClick, className }: IProps) => {
    return (
        <div
            className={`${styles['close_button']} ${className}`}
            onClick={handleClick}>
            <CrossIcon />
        </div>
    );
};

export default CloseButton;
