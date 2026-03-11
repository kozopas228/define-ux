import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './GoalsFrustrations.module.css';
import CloseButton from '../close-button/CloseButton';
import { UxPersonaDto } from '../types';
import { cloneDeep } from 'lodash';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}
const GoalsFrustrations = ({ uxPersona, setUxPersona }: IProps) => {
    const goalsRef = useRef<HTMLTextAreaElement>(null);
    const frustrationsRef = useRef<HTMLTextAreaElement>(null);

    // Need to resize textarea because height displays incorrectly
    useEffect(() => {
        goalsRef.current!.style.height = 'auto';
        frustrationsRef.current!.style.height = 'auto';

        goalsRef.current!.style.height =
            Math.min(goalsRef.current!.scrollHeight, 400) + 'px';
        frustrationsRef.current!.style.height =
            Math.min(frustrationsRef.current!.scrollHeight, 400) + 'px';
    }, [uxPersona]);

    function handleGoalsOnInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);

            copiedPersona.goals = e.target.value;

            return copiedPersona;
        });

        goalsRef.current!.style.height = 'auto';
        goalsRef.current!.style.height =
            Math.min(goalsRef.current!.scrollHeight, 400) + 'px';
    }

    function handleFrustrationsOnInput(
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);

            copiedPersona.frustrations = e.target.value;

            return copiedPersona;
        });

        frustrationsRef.current!.style.height = 'auto';
        frustrationsRef.current!.style.height =
            Math.min(frustrationsRef.current!.scrollHeight, 400) + 'px';
    }

    function handleMouseDown() {
        if (!uxPersona.hasGoals_frustrations) {
            setUxPersona((prev) => {
                const copiedPersona = cloneDeep(prev);

                copiedPersona.hasGoals_frustrations = true;

                return copiedPersona;
            });
        }
    }
    function handleCloseClick(e: React.MouseEvent) {
        e.stopPropagation();
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);

            copiedPersona.hasGoals_frustrations = false;
            copiedPersona.goals = undefined;
            copiedPersona.frustrations = undefined;

            return copiedPersona;
        });
    }

    return (
        <div
            className={`${styles['goals_and_frustrations']} ${
                !uxPersona.hasGoals_frustrations
                    ? `${styles['disabled']} disabled_block_export_jpeg`
                    : ''
            }`}>
            <div
                className={styles['content']}
                onMouseDown={handleMouseDown}>
                <div className={styles['goals']}>
                    <p
                        className={`text-big-bold ${
                            uxPersona.hasGoals_frustrations
                                ? 'color-gray-800'
                                : 'color-gray-600'
                        }`}>
                        Goals
                    </p>
                    <textarea
                        className={`${
                            uxPersona.hasGoals_frustrations
                                ? 'color-dark-900'
                                : 'color-gray-600'
                        } text-normal ux_persona_textarea_export_jpg`}
                        value={uxPersona.goals}
                        placeholder={`Goal 1\nGoal 2\nGoal 3`}
                        ref={goalsRef}
                        onInput={handleGoalsOnInput}
                        maxLength={300}
                    />
                    <pre
                        className={`text-normal color-dark-900 ux_persona_textarea_export_hidden_jpg`}
                        style={{
                            display: 'none',
                            whiteSpace: 'pre-wrap',
                            width: '100%',
                        }}>
                        {uxPersona.goals}
                    </pre>
                </div>
                <div className={styles['frustrations']}>
                    <p
                        className={`text-big-bold ${
                            uxPersona.hasGoals_frustrations
                                ? 'color-gray-800'
                                : 'color-gray-600'
                        }`}>
                        Frustrations
                    </p>
                    <textarea
                        className={`${
                            uxPersona.hasGoals_frustrations
                                ? 'color-dark-900'
                                : 'color-gray-600'
                        } text-normal ux_persona_textarea_export_jpg`}
                        value={uxPersona.frustrations}
                        placeholder={`Frustration 1\nFrustration 2\nFrustration 3`}
                        ref={frustrationsRef}
                        onInput={handleFrustrationsOnInput}
                        maxLength={300}
                    />
                    <pre
                        className={`text-normal color-dark-900 ux_persona_textarea_export_hidden_jpg`}
                        style={{
                            display: 'none',
                            whiteSpace: 'pre-wrap',
                            width: '100%',
                        }}>
                        {uxPersona.frustrations}
                    </pre>
                </div>
            </div>
            {uxPersona.hasGoals_frustrations && (
                <CloseButton
                    handleClick={handleCloseClick}
                    className={`close_button_export_jpeg`}
                />
            )}
        </div>
    );
};

export default GoalsFrustrations;
