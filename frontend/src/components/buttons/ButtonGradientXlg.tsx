import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import './buttons.css';

interface IProps {
    children: React.ReactNode;
    className?: any;
    style?: any;
    onClick?: any;
}

const ButtonGradientXlg = ({ children, className, style, onClick }: IProps) => {
    return (
        <button
            className={`button button-gradient-xlg text-bigger-bold shadow1 ${
                className ?? ''
            }`}
            style={style}
            onClick={onClick}>
            <h4 className={'gradient-xlg-text'}>{children}</h4>
        </button>
    );
};

export default ButtonGradientXlg;
