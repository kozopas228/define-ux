import React from 'react';
import './inputs.css';

interface IProps {
    className?: any;
    style?: any;
    placeholder?: string;
    value?: any;
}

const TextFieldSecondaryDisabled = ({
    className,
    style,
    placeholder,
    value,
}: IProps) => {
    return (
        <input
            className={`input text-field-secondary-disabled text-normal ${
                className ?? ''
            }`}
            style={style}
            placeholder={placeholder ?? ''}
            disabled={true}
            value={value}
        />
    );
};

export default TextFieldSecondaryDisabled;
