import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
}

const ButtonOutlineDangerLg = ({ children, className, style }: IProps) => {
    return (
        <button
            className={`button button-outline-danger-lg text-big-bold ${
                className ?? ''
            }`}
            style={style}>
            {children}
        </button>
    );
};

export default ButtonOutlineDangerLg;
