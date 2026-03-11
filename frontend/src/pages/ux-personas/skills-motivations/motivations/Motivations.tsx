import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './Motivations.module.css';
import CloseButton from '../../close-button/CloseButton';
import SkillMotivationItem from '../skill-motivation-item/SkillMotivationItem';
import ButtonSecondary from '../../../../components/buttons/ButtonSecondary';
import ButtonSecondaryDisabled from '../../../../components/buttons/ButtonSecondaryDisabled';
import { SkillMotivation, UxPersonaDto } from '../../types';
import { v4 } from 'uuid';
import { UUID } from '../../../../types/uuid';
import { cloneDeep } from 'lodash';
import { MAX_SKILL_MOTIVATION_AMOUNT } from '../../../../utils/constants';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}
const Motivations = ({ uxPersona, setUxPersona }: IProps) => {
    function handleMouseDown() {
        if (!uxPersona.hasMotivations) {
            setUxPersona((prev) => {
                const copiedPersona = cloneDeep(prev);

                copiedPersona.hasMotivations = true;

                return copiedPersona;
            });
        }
    }
    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);

            copiedPersona.hasMotivations = false;

            return copiedPersona;
        });
    }

    function handleAddNewClick() {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.motivations.push({
                id: v4() as UUID,
                name: '',
                level: 50,
            });
            return copiedPersona;
        });
    }

    function handleDeleteItem(id: UUID) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.motivations = copiedPersona.motivations.filter(
                (i) => i.id !== id
            );
            return copiedPersona;
        });
    }

    function handleSetItem(val: SkillMotivation) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            const motivation = copiedPersona.motivations.find(
                (s) => s.id === val.id
            );

            if (!motivation) {
                return copiedPersona;
            }

            motivation.name = val.name;
            motivation.level = val.level;
            return copiedPersona;
        });
    }

    return (
        <div
            className={`${styles['motivations']} ${
                !uxPersona.hasMotivations ? `disabled_block_export_jpeg` : ''
            }`}
            onMouseDown={handleMouseDown}>
            <p
                className={`text-big-bold ${
                    uxPersona.hasMotivations
                        ? 'color-gray-800'
                        : 'color-gray-600'
                } ${styles['heading']}`}>
                Motivations
            </p>
            {uxPersona.motivations.map((s) => (
                <SkillMotivationItem
                    placeholder={'Motivation name'}
                    isParentDisabled={!uxPersona.hasMotivations}
                    item={s}
                    setItem={handleSetItem}
                    key={s.id}
                    handleDeleteItem={handleDeleteItem}
                />
            ))}
            {uxPersona.hasMotivations &&
            uxPersona.motivations.length < MAX_SKILL_MOTIVATION_AMOUNT ? (
                <ButtonSecondary
                    className={`${styles['add_new_button']} add_new_skill_motivation_button_export_jpeg`}
                    onClick={handleAddNewClick}>
                    Add new motivation
                </ButtonSecondary>
            ) : (
                <ButtonSecondaryDisabled className={styles['add_new_button']}>
                    Add new motivation
                </ButtonSecondaryDisabled>
            )}
            {uxPersona.hasMotivations && (
                <CloseButton
                    handleClick={handleCloseClick}
                    className={`close_button_export_jpeg`}
                />
            )}
        </div>
    );
};

export default Motivations;
