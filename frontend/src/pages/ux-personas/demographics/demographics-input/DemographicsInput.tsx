import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './DemographicsInput.module.css';
import CloseButton from '../../close-button/CloseButton';
import { UxPersonaDto } from '../../types';

interface IProps {
    name: string;
    isEnabled: boolean;
    setIsEnabled: (enabled: boolean) => any;
    value: string | undefined;
    setValue: (val: string) => any;
}

const DemographicsInput = ({
    name,
    setIsEnabled,
    isEnabled,
    setValue,
    value,
}: IProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleMouseDown() {
        if (!isEnabled) {
            setIsEnabled(true);
        }
    }

    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();
        setIsEnabled(false);
        setValue('');
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code == 'Enter') {
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function onBlur() {}

    return (
        <div
            className={`${styles['demographics_input']} ${
                !isEnabled
                    ? `${styles['disabled']} disabled_flex_export_jpeg`
                    : ''
            }`}
            onMouseDown={handleMouseDown}>
            <input
                type={'text'}
                placeholder={name}
                className={`text-normal color-dark-900`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                ref={inputRef}
                maxLength={50}
            />
            {isEnabled && (
                <CloseButton
                    handleClick={handleCloseClick}
                    className={`${styles['demographics_input_close']} close_button_export_jpeg`}
                />
            )}
        </div>
    );
};

export default DemographicsInput;
