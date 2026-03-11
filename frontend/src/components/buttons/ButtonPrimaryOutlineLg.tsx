import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    onClick?: any;
}

const PrimaryOutlineButton = ({ children, className, style, onClick }: IProps) => {
    return (
        <button
            className={`button button-primary-outline-lg text-big-bold ${
                className ?? ''
            }`}
            style={style}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default PrimaryOutlineButton;
