import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    onClick?: any;
}

const ButtonPrimaryLg = ({ children, className, style, onClick }: IProps) => {
    return (
        <button
            onClick={onClick}
            className={`button button-primary-lg text-big-bold ${
                className ?? ''
            }`}
            style={style}>
            {children}
        </button>
    );
};

export default ButtonPrimaryLg;
