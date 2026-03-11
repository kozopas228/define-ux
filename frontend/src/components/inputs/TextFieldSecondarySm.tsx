import React from 'react';
import './inputs.css';

interface IProps {
    className?: any;
    style?: any;
    onChange?: any;
    onSubmit?: any;
    placeholder?: string;
    value?: string;
    maxLength?: number;
}

const TextFieldSecondarySm = ({
    className,
    style,
    onChange,
    onSubmit,
    placeholder,
    value,
    maxLength,
}: IProps) => {
    return (
        <input
            className={`input text-field-secondary-sm text-small ${
                className ?? ''
            }`}
            style={style}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder={placeholder ?? ''}
            value={value}
            maxLength={maxLength}
        />
    );
};

export default TextFieldSecondarySm;
