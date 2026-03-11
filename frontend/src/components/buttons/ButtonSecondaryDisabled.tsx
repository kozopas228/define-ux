import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    onClick?: any;
    title?: string;
}

const ButtonSecondaryDisabled = ({
    children,
    className,
    style,
    onClick,
    title,
}: IProps) => {
    return (
        <button
            className={`button button-secondary-disabled text-normal ${
                className ?? ''
            }`}
            style={style}
            onClick={onClick}
            title={title}>
            {children}
        </button>
    );
};

export default ButtonSecondaryDisabled;
