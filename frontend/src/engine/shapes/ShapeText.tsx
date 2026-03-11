import React, { useEffect, useRef, useState } from 'react';

interface IProps {
    isEditing: boolean;
    text?: string;
    saveText: (newText: string | undefined) => void;
}

const ShapeText = ({ text, isEditing, saveText }: IProps) => {
    const [internalTextState, setInternalTextState] = useState(text);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current!.focus();
        } else {
            saveText(internalTextState);
        }

        const enterListener = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                saveText(internalTextState);
            }
        };

        window.addEventListener('keydown', enterListener);

        return () => {
            window.removeEventListener('keydown', enterListener);
        };
    }, [internalTextState, isEditing, saveText]);

    function handleInputChange(e: any) {
        setInternalTextState(e.target.value);
    }

    function handleInputMouseDown(e: React.MouseEvent) {
        e.stopPropagation();
    }

    function handeInputBlur(e: React.FocusEvent) {
        saveText(internalTextState);
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                // backgroundColor: 'rgba(38,196,27,0.58)',
                padding: 10,
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                overflow: isEditing ? 'visible' : 'hidden',
                fontSize: 18,
                fontFamily: 'Roboto',
            }}>
            {isEditing ? (
                <input
                    type={'text'}
                    value={internalTextState}
                    ref={inputRef}
                    onChange={handleInputChange}
                    onMouseDown={handleInputMouseDown}
                    onBlur={handeInputBlur}
                    style={{
                        outline: 'none',
                        background: 'transparent',
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        fontSize: 18,
                        fontFamily: 'Roboto',
                        border: 'none',
                        overflow: 'auto',
                        resize: 'none',
                    }}
                />
            ) : (
                <div>{internalTextState}</div>
            )}
        </div>
    );
};

export default ShapeText;
