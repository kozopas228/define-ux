import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
}

const ButtonSecondaryOutlineDisabled = ({
    children,
    className,
    style,
}: IProps) => {
    return (
        <button
            className={`button button-secondary-outline-disabled text-normal ${
                className ?? ''
            }`}
            style={style}>
            {children}
        </button>
    );
};

export default ButtonSecondaryOutlineDisabled;
