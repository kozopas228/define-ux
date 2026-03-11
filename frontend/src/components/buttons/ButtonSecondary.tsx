import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    onClick?: any;
}

const ButtonSecondary = ({ children, className, style, onClick }: IProps) => {
    return (
        <button
            className={`button button-secondary text-normal ${className ?? ''}`}
            style={style}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default ButtonSecondary;
