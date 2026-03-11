import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    title?: string;
}

const ButtonPrimaryDisabled = ({
    children,
    className,
    style,
    title,
}: IProps) => {
    return (
        <button
            className={`button button-primary-disabled text-normal ${
                className ?? ''
            }`}
            style={style}
            disabled={true}
            title={title}>
            {children}
        </button>
    );
};

export default ButtonPrimaryDisabled;
