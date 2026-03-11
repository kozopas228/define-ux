import React from 'react';
import styles from './Spinner.module.css';
import SpinnerIcon from '../../assets/icons/spinner.svg';

interface IProps {
    className?: string;
}

const Spinner = ({ className }: IProps) => {
    return (
        <div className={`${styles['spinner']} ${className}`}>
            <SpinnerIcon />
        </div>
    );
};

export default Spinner;
