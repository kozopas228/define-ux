import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
}

const ButtonPrimaryLgDisabled = ({ children, className, style }: IProps) => {
    return (
        <button
            className={`button button-primary-lg-disabled text-big-bold ${
                className ?? ''
            }`}
            style={style}
            disabled={true}>
            {children}
        </button>
    );
};

export default ButtonPrimaryLgDisabled;
