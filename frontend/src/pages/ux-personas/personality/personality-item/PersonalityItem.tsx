import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './PersonalityItem.module.css';
import CloseButton from '../../close-button/CloseButton';

interface IProps {
    property1: string;
    property2: string;
    value: number;
    setValue: Dispatch<SetStateAction<number>>;
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
}

const PersonalityItem = ({
    property1,
    property2,
    value,
    setValue,
    enabled,
    setEnabled,
}: IProps) => {
    function handleMouseDown() {
        if (!enabled) {
            setEnabled(true);
        }
    }
    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();
        setEnabled(false);
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(Number(e.target.value));
    }

    return (
        <div
            className={`${styles['personality_item']} ${
                !enabled
                    ? `${styles['disabled']} disabled_flex_export_jpeg`
                    : ''
            }`}>
            <div className={styles['personality_slider']}>
                <div className={styles['slider_heading']}>
                    <span
                        className={`${
                            enabled
                                ? 'text-small color-dark-900'
                                : 'text-small color-gray-600'
                        }`}>
                        {property1}
                    </span>
                    <span
                        className={`${
                            enabled
                                ? 'text-small color-dark-900'
                                : 'text-small color-gray-600'
                        }`}>
                        {property2}
                    </span>
                </div>
                <input
                    type='range'
                    min='0'
                    max='100'
                    className={`${styles['slider']} personality_item_input_export_jpeg`}
                    value={value}
                    onChange={handleOnChange}
                    onMouseDown={handleMouseDown}
                />
                <div
                    className={'personality_item_slider_export_jpeg'}
                    style={{
                        position: 'relative',
                        display: 'none',
                        marginTop: 8,
                        height: 24,
                        borderRadius: 8,
                        overflow: 'hidden',
                        width: '100%',
                        backgroundColor: 'var(--gray-200)',
                    }}>
                    <div
                        style={{
                            height: '100%',
                            width: `100%`,
                            position: 'relative',
                            left: '-100%',
                            transform: `translateX(calc(${value}% - 12px))`,
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}>
                        <div
                            style={{
                                height: 24,
                                width: 24,
                                backgroundColor: 'var(--blue-500)',
                                transform: 'translateX(24px)',
                            }}></div>
                    </div>
                </div>
            </div>
            <CloseButton
                handleClick={handleCloseClick}
                className={`${styles['personality_close_button']} close_button_export_jpeg`}
            />
        </div>
    );
};

export default PersonalityItem;
