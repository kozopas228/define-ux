import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import styles from './ChangeColumnDropdown.module.css';
import useOutsideClick from '../../../../../hooks/useOutsideClick';
import ThreeDotsIcon from '../../../../../assets/icons/three-dots.svg';
import ChangeIcon from '../../../../../assets/icons/convert-shapes.svg';
import PencilIcon from '../../../../../assets/icons/pencil.svg';
import CrossIcon from '../../../../../assets/icons/cross.svg';
import BooleanIcon from '../../../../../assets/icons/radio-button.svg';
import TextIcon from '../../../../../assets/icons/align-center.svg';
import { CompetitorResponseDto, CriteriaResponseDto } from '../../../types';
import { SCREEN_MIN_BOUNDARY_L } from '../../../../../utils/constants';
import { useScreenSize } from '../../../../../hooks/useScreenSize';

enum ChangeColumnDropdownState {
    init,
    changeType,
}

enum ColumnType {
    boolean,
    text,
}

interface IProps {
    setInputActive: any;
    handleDelete: any;
    handleChangeColumnType: (columnType: 'string' | 'boolean') => void;
}

const ChangeColumnDropdown = ({
    setInputActive,
    handleDelete,
    handleChangeColumnType,
}: IProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [dropdownState, setDropdownState] = useState(
        ChangeColumnDropdownState.init
    );

    const screenSize = useScreenSize();

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation();
        setDropdownState(ChangeColumnDropdownState.init);
        setIsOpen((prev) => !prev);
    }

    useOutsideClick({
        ref: dropdownRef,
        handler: () => {
            setIsOpen(false);
            setDropdownState(ChangeColumnDropdownState.init);
        },
    });

    function handleChangeClick(e: React.MouseEvent) {
        e.stopPropagation();
        setDropdownState(ChangeColumnDropdownState.changeType);
    }

    function handleSetColumnType(columnType: ColumnType) {
        if (columnType === ColumnType.text) {
            handleChangeColumnType('string');
        } else {
            handleChangeColumnType('boolean');
        }

        setDropdownState(ChangeColumnDropdownState.init);
    }

    function handleChangeColumnTypeClick() {}

    function handleRenameClick() {
        setInputActive();
    }

    function handleDeleteClick() {
        handleDelete();
    }

    let layout: React.JSX.Element = <></>;

    if (dropdownState === ChangeColumnDropdownState.init) {
        layout = (
            <>
                <div
                    className={`${styles['item']} ${styles['change_column_type_item']}`}
                    onClick={handleChangeClick}>
                    <ChangeIcon />
                    <span
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? 'color-dark-900 text-normal'
                                : 'color-dark-900 text-small'
                        }>
                        Change Column Type
                    </span>
                </div>
                <div
                    className={`${styles['item']} ${styles['rename_column_item']}`}
                    onClick={handleRenameClick}>
                    <PencilIcon />
                    <span
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? 'color-dark-900 text-normal'
                                : 'color-dark-900 text-small'
                        }>
                        Rename Column
                    </span>
                </div>
                <div
                    className={`${styles['item']} ${styles['delete_column_item']}`}
                    onClick={handleDeleteClick}>
                    <CrossIcon />
                    <span
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? 'color-dark-900 text-normal'
                                : 'color-dark-900 text-small'
                        }>
                        Delete Column
                    </span>
                </div>
            </>
        );
    } else if (dropdownState === ChangeColumnDropdownState.changeType) {
        layout = (
            <>
                <div
                    className={`${styles['item']} ${styles['set_boolean_type_item']}`}
                    onClick={() => handleSetColumnType(ColumnType.boolean)}>
                    <BooleanIcon />
                    <span
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? 'color-dark-900 text-normal'
                                : 'color-dark-900 text-small'
                        }>
                        Yes or No
                    </span>
                </div>
                <div
                    className={`${styles['item']} ${styles['set_text_type_item']}`}
                    onClick={() => handleSetColumnType(ColumnType.text)}>
                    <TextIcon />
                    <span
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? 'color-dark-900 text-normal'
                                : 'color-dark-900 text-small'
                        }>
                        Text
                    </span>
                </div>
            </>
        );
    }

    return (
        <div
            className={styles['change_column_dropdown']}
            onClick={handleClick}
            ref={dropdownRef}>
            <ThreeDotsIcon />
            <div
                className={`${styles['content']} shadow1 ${
                    isOpen ? styles['active'] : ''
                }`}>
                {layout}
            </div>
        </div>
    );
};

export default ChangeColumnDropdown;
