import React, {
    ChangeEvent,
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './Biography.module.css';
import { UxPersonaDto } from '../types';
import { cloneDeep } from 'lodash';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}
const Biography = ({ uxPersona, setUxPersona }: IProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current!.style.height =
            Math.min(textareaRef.current!.scrollHeight, 600) + 'px';
    }, []);

    function handleOnInput() {
        textareaRef.current!.style.height = 'auto';
        textareaRef.current!.style.height =
            Math.min(textareaRef.current!.scrollHeight, 600) + 'px';
    }

    function handleOnChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);

            copiedPersona.biography = e.target.value;

            return copiedPersona;
        });
    }

    return (
        <>
            <textarea
                className={`${styles['biography']} text-normal color-dark-900 ux_persona_textarea_export_jpg`}
                onChange={handleOnChange}
                ref={textareaRef}
                onInput={handleOnInput}
                maxLength={1000}
                placeholder={'Biography'}
                value={uxPersona.biography}
            />
            <pre
                className={`${styles['biography']} text-normal color-dark-900 ux_persona_textarea_export_hidden_jpg`}
                style={{
                    display: 'none',
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                    overflow: 'hidden',
                }}>
                {uxPersona.biography}
            </pre>
        </>
    );
};

export default Biography;
