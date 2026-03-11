import React, { Dispatch, SetStateAction } from 'react';
import styles from './CriteriaCheckbox.module.css';
import { CompetitorResponseDto, CriteriaResponseDto } from '../../../types';
import { cloneDeep } from 'lodash';

interface IProps {
    value: boolean;
    setValue: Dispatch<SetStateAction<string | boolean | undefined>>;
    competitor: CompetitorResponseDto;
    criteria: CriteriaResponseDto;
    setData: Dispatch<SetStateAction<CompetitorResponseDto[]>>;
}

const CriteriaCheckbox = ({
    value,
    setValue,
    criteria,
    setData,
    competitor,
}: IProps) => {
    function handleOnClick() {
        setValue((prev) => !prev);

        setData((prev) => {
            const copiedArray = cloneDeep(prev);
            const copiedComp = copiedArray.find((c) => c.id === competitor.id);
            const copiedCrit = copiedComp?.criterias.find(
                (cr) => cr.id === criteria.id
            );

            if (copiedCrit) {
                copiedCrit.value!.value = !copiedCrit.value!.value;
            }

            return copiedArray;
        });
    }

    return (
        <div
            className={`${styles['criteria_checkbox']} ${
                value ? styles['checked'] : ''
            }`}
            onClick={handleOnClick}
        />
    );
};

export default CriteriaCheckbox;
