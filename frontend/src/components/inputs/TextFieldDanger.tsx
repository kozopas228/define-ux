import React from 'react';
import './inputs.css';

interface IProps {
    className?: any;
    style?: any;
    onChange?: any;
    onSubmit?: any;
    placeholder?: string;
    value?: any;
    type?: string;
}

const TextFieldDanger = ({
    className,
    style,
    onChange,
    onSubmit,
    placeholder,
    value,
    type,
}: IProps) => {
    return (
        <input
            className={`input text-field-danger text-normal ${className ?? ''}`}
            style={style}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder={placeholder ?? ''}
            value={value}
            type={type}
        />
    );
};

export default TextFieldDanger;
