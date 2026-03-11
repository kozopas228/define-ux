import React, { useEffect, useState } from 'react';
import styles from './SkillMotivationItem.module.css';
import CloseButton from '../../close-button/CloseButton';
import TextFieldSecondarySm from '../../../../components/inputs/TextFieldSecondarySm';
import { SkillMotivation } from '../../types';

interface IProps {
    placeholder: string;
    isParentDisabled: boolean;
    item: SkillMotivation;
    handleDeleteItem: any;
    setItem: (item: SkillMotivation) => any;
}

const SkillMotivationItem = ({
    placeholder,
    isParentDisabled,
    item,
    handleDeleteItem,
    setItem,
}: IProps) => {
    function handleMouseDown() {}
    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();
        handleDeleteItem(item.id);
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        item.level = Number(e.target.value);
        setItem(item);
    }

    function handleNameOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        item.name = e.target.value;
        setItem(item);
    }

    return (
        <div
            className={`${styles['skill_motivation_item']} ${
                isParentDisabled ? styles['disabled'] : ''
            }`}>
            <div
                className={styles['inputs']}
                onMouseDown={handleMouseDown}>
                <TextFieldSecondarySm
                    value={item.name}
                    placeholder={placeholder}
                    className={styles['skill_motivation_name']}
                    onChange={handleNameOnChange}
                    maxLength={50}
                />
                <input
                    type='range'
                    min='0'
                    max='100'
                    className={`${styles['slider']} skill_motivation_input_export_jpeg`}
                    value={item.level}
                    onChange={handleOnChange}
                />
                <div
                    className={'skill_motivation_slider_export_jpeg'}
                    style={{
                        position: 'relative',
                        display: 'none',
                        marginTop: 8,
                        height: 24,
                        backgroundColor: 'var(--gray-200)',
                        borderRadius: 8,
                        overflow: 'hidden',
                        width: '100%',
                    }}>
                    <div
                        style={{
                            height: '100%',
                            width: `100%`,
                            backgroundColor: 'var(--blue-300)',
                            position: 'relative',
                            left: '-100%',
                            transform: `translateX(calc(${item.level}% - 12px))`,
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
                className={`${styles['input_close_button']} close_button_export_jpeg`}
            />
        </div>
    );
};

export default SkillMotivationItem;
