import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './CriteriaHeader.module.css';
import { ColumnDef, flexRender, Header } from '@tanstack/react-table';
import ChangeColumnDropdown from './change-column-dropdown/ChangeColumnDropdown';
import { CompetitorResponseDto, CriteriaResponseDto } from '../../types';
import { cloneDeep } from 'lodash';
import { v4 } from 'uuid';
import { UUID } from '../../../../engine/types/Uuid';
import { SCREEN_MIN_BOUNDARY_L } from '../../../../utils/constants';
import { useScreenSize } from '../../../../hooks/useScreenSize';

interface IProps {
    criteria: CriteriaResponseDto;
    setData: Dispatch<SetStateAction<CompetitorResponseDto[]>>;
    setCriterias: Dispatch<SetStateAction<CriteriaResponseDto[]>>;
}

const CriteriaHeader = ({ criteria, setCriterias, setData }: IProps) => {
    const [isActive, setIsActive] = useState(false);
    const [value, setValue] = useState<string>(criteria.name);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const screenSize = useScreenSize();

    const onBlur = () => {
        setIsActive(false);

        setCriterias((prev) => {
            const copiedArray = cloneDeep(prev);
            const crit = copiedArray.find((cr) => cr.id === criteria.id);

            if (crit) {
                crit.name = value;
            }

            return copiedArray;
        });

        setData((prev) => {
            const copiedArray = cloneDeep(prev);
            copiedArray.forEach((comp) => {
                const crit = comp.criterias.find((cr) => cr.id === criteria.id);

                if (crit) {
                    crit.name = value;
                }
            });

            return copiedArray;
        });
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [isActive]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code == 'Enter') {
                setIsActive(false);
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function handleSetActive() {
        setIsActive(true);
    }

    function handleDeleteColumn() {
        setCriterias((prev) => {
            let copiedArray = cloneDeep(prev);
            const crit = copiedArray.find((cr) => cr.id === criteria.id);

            if (crit) {
                copiedArray = copiedArray.filter((cr) => cr.id !== criteria.id);
            }

            return copiedArray;
        });

        setData((prev) => {
            const copiedArray = cloneDeep(prev);
            copiedArray.forEach((comp) => {
                const crit = comp.criterias.find((cr) => cr.id === criteria.id);

                if (crit) {
                    comp.criterias = comp.criterias.filter(
                        (cr) => cr.id !== crit.id
                    );
                }
            });

            return copiedArray;
        });
    }

    function handleChangeColumnType(columnType: 'string' | 'boolean') {
        setCriterias((prev) => {
            const copiedArray = cloneDeep(prev);

            const crit = copiedArray.find((cr) => cr.id === criteria.id);

            if (crit && crit.type !== columnType) {
                crit.type = columnType;
            }

            return copiedArray;
        });

        setData((prev) => {
            const copiedArray = cloneDeep(prev);

            copiedArray.forEach((comp) => {
                const crit = comp.criterias.find((cr) => cr.id === criteria.id);

                if (crit && crit.type !== columnType) {
                    crit.type = columnType;

                    if (columnType === 'string') {
                        crit.value = {
                            value: '',
                            id: v4() as UUID,
                        };
                    } else {
                        crit.value = {
                            value: false,
                            id: v4() as UUID,
                        };
                    }
                }
            });

            return copiedArray;
        });
    }

    return isActive ? (
        <input
            value={String(value)}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            ref={inputRef}
            className={`${
                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                    ? 'text-big-bold color-dark-900'
                    : 'text-normal-bold color-dark-900'
            } ${styles['header_criteria_input']}`}
            maxLength={300}
        />
    ) : (
        <div
            className={`${
                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                    ? 'text-big-bold color-white'
                    : 'text-normal-bold color-white'
            } ${styles['header_criteria']}`}
            onClick={handleSetActive}>
            <span>{value}</span>
            <ChangeColumnDropdown
                setInputActive={handleSetActive}
                handleDelete={handleDeleteColumn}
                handleChangeColumnType={handleChangeColumnType}
            />
        </div>
    );
};

export default CriteriaHeader;
