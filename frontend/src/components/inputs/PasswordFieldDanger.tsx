import React, { useState } from 'react';
import './inputs.css';
import ToggleEyeIcon from '../../assets/icons/eye.svg';
import { ICON_VIEW_BOX } from '../../utils/constants';

interface IProps {
    className?: any;
    style?: any;
    onChange?: any;
    onSubmit?: any;
    placeholder?: string;
    value?: any;
    autofocus?: boolean;
}

const PasswordFieldDanger = ({
    className,
    style,
    onChange,
    onSubmit,
    placeholder,
    value,
    autofocus,
}: IProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function handleEyeClick() {
        setIsPasswordVisible((prev) => !prev);
    }

    return (
        <div
            className={`input password-field-danger ${className ?? ''}`}
            style={style}>
            <input
                className={`text-normal`}
                onChange={onChange}
                onSubmit={onSubmit}
                placeholder={placeholder ?? ''}
                value={value}
                autoFocus={autofocus}
                type={isPasswordVisible ? 'text' : 'password'}
            />
            <ToggleEyeIcon
                className={'password-field-danger-icon'}
                viewBox={ICON_VIEW_BOX}
                onClick={handleEyeClick}
            />
        </div>
    );
};

export default PasswordFieldDanger;
