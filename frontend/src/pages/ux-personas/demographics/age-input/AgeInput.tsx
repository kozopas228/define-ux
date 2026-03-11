import React, {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './AgeInput.module.css';
import { UxPersonaDto } from '../../types';
import { cloneDeep } from 'lodash';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}

const AgeInput = ({ uxPersona, setUxPersona }: IProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

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

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.demographics_age =
                e.target.value !== '' ? Number(e.target.value) : undefined;
            return copiedPersona;
        });
    }

    function onBlur() {}

    return (
        <input
            type={'number'}
            placeholder={'Age'}
            className={`text-normal color-dark-900 ${styles['age_input']}`}
            value={uxPersona.demographics_age ?? ''}
            onChange={handleChange}
            onBlur={onBlur}
            ref={inputRef}
        />
    );
};

export default AgeInput;
