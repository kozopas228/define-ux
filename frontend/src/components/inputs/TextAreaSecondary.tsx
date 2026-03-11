import React from 'react';
import './inputs.css';

interface IProps {
    className?: any;
    style?: any;
    onChange?: any;
    onSubmit?: any;
    placeholder?: string;
    value?: string;
}

const TextAreaSecondary = ({
    className,
    style,
    onChange,
    onSubmit,
    placeholder,
    value,
}: IProps) => {
    return (
        <textarea
            className={`input text-area-secondary text-normal ${
                className ?? ''
            }`}
            style={style}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder={placeholder ?? ''}
            value={value}></textarea>
    );
};

export default TextAreaSecondary;
