import React from 'react';
import './inputs.css';

interface IProps {
    className?: any;
    style?: any;
    onChange?: any;
    onSubmit?: any;
    placeholder?: string;
    value?: any;
    autofocus?: boolean;
    type?: string;
}

const TextFieldSecondary = ({
    className,
    style,
    onChange,
    onSubmit,
    placeholder,
    value,
    autofocus,
    type,
}: IProps) => {
    return (
        <input
            className={`input text-field-secondary text-normal ${
                className ?? ''
            }`}
            style={style}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder={placeholder ?? ''}
            value={value}
            autoFocus={autofocus}
            type={type}
        />
    );
};

export default TextFieldSecondary;
