import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    onClick?: any;
}

const ButtonPrimaryOutline = ({ children, className, style, onClick }: IProps) => {
    return (
        <button
            className={`button button-primary-outline text-normal ${
                className ?? ''
            }`}
            onClick={onClick}
            style={style}>
            {children}
        </button>
    );
};

export default ButtonPrimaryOutline;
