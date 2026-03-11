import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './Skills.module.css';
import CloseButton from '../../close-button/CloseButton';
import SkillMotivationItem from '../skill-motivation-item/SkillMotivationItem';
import ButtonSecondary from '../../../../components/buttons/ButtonSecondary';
import ButtonSecondaryDisabled from '../../../../components/buttons/ButtonSecondaryDisabled';
import { SkillMotivation, UxPersonaDto } from '../../types';
import { v4 } from 'uuid';
import { UUID } from '../../../../types/uuid';
import { deepCopy } from '@tldraw/tldraw';
import { cloneDeep } from 'lodash';
import { MAX_SKILL_MOTIVATION_AMOUNT } from '../../../../utils/constants';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}
const Skills = ({ uxPersona, setUxPersona }: IProps) => {
    function handleMouseDown() {
        if (!uxPersona.hasSkills) {
            setUxPersona((prev) => {
                const copiedPersona = cloneDeep(prev);

                copiedPersona.hasSkills = true;

                return copiedPersona;
            });
        }
    }
    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);

            copiedPersona.hasSkills = false;

            return copiedPersona;
        });
    }

    function handleAddNewClick() {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.skills.push({
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
            copiedPersona.skills = copiedPersona.skills.filter(
                (i) => i.id !== id
            );
            return copiedPersona;
        });
    }

    function handleSetItem(val: SkillMotivation) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            const skill = copiedPersona.skills.find((s) => s.id === val.id);

            if (!skill) {
                return copiedPersona;
            }

            skill.name = val.name;
            skill.level = val.level;
            return copiedPersona;
        });
    }

    return (
        <div
            className={`${styles['skills']} ${
                !uxPersona.hasSkills ? `disabled_block_export_jpeg` : ''
            }`}
            onMouseDown={handleMouseDown}>
            <p
                className={`text-big-bold ${
                    uxPersona.hasSkills ? 'color-gray-800' : 'color-gray-600'
                } ${styles['heading']}`}>
                Skills
            </p>
            {uxPersona.skills.map((s) => (
                <SkillMotivationItem
                    placeholder={'Skill name'}
                    isParentDisabled={!uxPersona.hasSkills}
                    item={s}
                    setItem={handleSetItem}
                    key={s.id}
                    handleDeleteItem={handleDeleteItem}
                />
            ))}
            {uxPersona.hasSkills &&
            uxPersona.skills.length < MAX_SKILL_MOTIVATION_AMOUNT ? (
                <ButtonSecondary
                    className={`${styles['add_new_button']} add_new_skill_motivation_button_export_jpeg`}
                    onClick={handleAddNewClick}>
                    Add new skill
                </ButtonSecondary>
            ) : (
                <ButtonSecondaryDisabled className={styles['add_new_button']}>
                    Add new skill
                </ButtonSecondaryDisabled>
            )}
            {uxPersona.hasSkills && (
                <CloseButton
                    handleClick={handleCloseClick}
                    className={`close_button_export_jpeg`}
                />
            )}
        </div>
    );
};

export default Skills;
