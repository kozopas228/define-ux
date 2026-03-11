import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './Personality.module.css';
import PersonalityItem from './personality-item/PersonalityItem';
import CloseButton from '../close-button/CloseButton';
import { UxPersonaDto } from '../types';
import { cloneDeep } from 'lodash';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}
const Personality = ({ uxPersona, setUxPersona }: IProps) => {
    function handleMouseDown() {
        if (!uxPersona.hasPersonality) {
            setUxPersona((prev) => {
                const copiedPersona = cloneDeep(prev);

                copiedPersona.hasPersonality = true;

                return copiedPersona;
            });
        }
    }
    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);

            copiedPersona.hasPersonality = false;
            copiedPersona.hasPersonality_introvert_extrovert = false;
            copiedPersona.hasPersonality_thinking_feeling = false;
            copiedPersona.hasPersonality_sensing_intuition = false;
            copiedPersona.hasPersonality_judging_perceiving = false;

            return copiedPersona;
        });
    }

    function handleIntrovertExtrovertEnabled(enabled: boolean) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.hasPersonality_introvert_extrovert = enabled;
            return clonedPersona;
        });
    }
    function handleIntrovertExtrovertSetValue(value: number) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.personality_introvert_extrovert = value;
            return clonedPersona;
        });
    }

    function handleThinkingFeelingEnabled(enabled: boolean) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.hasPersonality_thinking_feeling = enabled;
            return clonedPersona;
        });
    }
    function handleThinkingFeelingSetValue(value: number) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.personality_thinking_feeling = value;
            return clonedPersona;
        });
    }

    function handleSensingIntuitionEnabled(enabled: boolean) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.hasPersonality_sensing_intuition = enabled;
            return clonedPersona;
        });
    }
    function handleSensingIntuitionSetValue(value: number) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.personality_sensing_intuition = value;
            return clonedPersona;
        });
    }

    function handleJudgingPerceivingEnabled(enabled: boolean) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.hasPersonality_judging_perceiving = enabled;
            return clonedPersona;
        });
    }
    function handleJudgingPerceivingSetValue(value: number) {
        setUxPersona((prev) => {
            const clonedPersona = cloneDeep(prev);
            clonedPersona.personality_judging_perceiving = value;
            return clonedPersona;
        });
    }

    return (
        <div
            className={`${styles['personality']} ${
                !uxPersona.hasPersonality ? `disabled_block_export_jpeg` : ''
            }`}
            onMouseDown={handleMouseDown}>
            <div
                className={`text-big-bold ${
                    uxPersona.hasPersonality
                        ? 'color-gray-800'
                        : 'color-gray-600'
                } ${styles['heading']}`}>
                Personality
            </div>
            <PersonalityItem
                property1={'Introvert'}
                property2={'Extrovert'}
                enabled={uxPersona.hasPersonality_introvert_extrovert}
                setEnabled={handleIntrovertExtrovertEnabled}
                value={uxPersona.personality_introvert_extrovert}
                setValue={handleIntrovertExtrovertSetValue}
            />
            <PersonalityItem
                property1={'Thinking'}
                property2={'Feeling'}
                enabled={uxPersona.hasPersonality_thinking_feeling}
                setEnabled={handleThinkingFeelingEnabled}
                value={uxPersona.personality_thinking_feeling}
                setValue={handleThinkingFeelingSetValue}
            />
            <PersonalityItem
                property1={'Sensing'}
                property2={'Intuition'}
                enabled={uxPersona.hasPersonality_sensing_intuition}
                setEnabled={handleSensingIntuitionEnabled}
                value={uxPersona.personality_sensing_intuition}
                setValue={handleSensingIntuitionSetValue}
            />
            <PersonalityItem
                property1={'Judging'}
                property2={'Perceiving'}
                enabled={uxPersona.hasPersonality_judging_perceiving}
                setEnabled={handleJudgingPerceivingEnabled}
                value={uxPersona.personality_judging_perceiving}
                setValue={handleJudgingPerceivingSetValue}
            />
            {uxPersona.hasPersonality && (
                <CloseButton
                    handleClick={handleCloseClick}
                    className={'close_button_export_jpeg'}
                />
            )}
        </div>
    );
};

export default Personality;
