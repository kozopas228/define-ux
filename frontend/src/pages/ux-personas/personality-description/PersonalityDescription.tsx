import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './PersonalityDescription.module.css';
import CloseButton from '../close-button/CloseButton';
import { UxPersonaDto } from '../types';
import { cloneDeep } from 'lodash';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}
const PersonalityDescription = ({ uxPersona, setUxPersona }: IProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleMouseDown() {
        if (!uxPersona.hasDescription) {
            setUxPersona((prev) => {
                const clonedPersona = cloneDeep(prev);
                clonedPersona.hasDescription = true;
                return clonedPersona;
            });
        }
    }

    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();

        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.hasDescription = false;
            clonedPersona.personality = '';
            return clonedPersona;
        });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.personality = e.target.value;
            return clonedPersona;
        });
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
            className={`${styles['personality_description']} ${
                !uxPersona.hasDescription
                    ? `${styles['disabled']} disabled_block_export_jpeg`
                    : ''
            }`}
            onMouseDown={handleMouseDown}>
            <input
                type={'text'}
                placeholder={'Few words that describe personality'}
                className={`text-normal color-dark-900`}
                value={uxPersona.personality}
                onChange={handleChange}
                onBlur={onBlur}
                ref={inputRef}
                maxLength={50}
            />
            {uxPersona.hasDescription && (
                <CloseButton
                    handleClick={handleCloseClick}
                    className={'close_button_export_jpeg'}
                />
            )}
        </div>
    );
};

export default PersonalityDescription;
