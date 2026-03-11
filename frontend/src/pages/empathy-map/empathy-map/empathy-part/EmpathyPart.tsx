import React, { useState } from 'react';
import { EmpathyPartType } from '../../types';
import styles from './EmpathyPart.module.css';
import { useScreenSize } from '../../../../hooks/useScreenSize';
import { MAX_EMPATHY_MAP_FIELD_LENGTH, SCREEN_MIN_BOUNDARY_L } from "../../../../utils/constants";

interface IProps {
    partType: EmpathyPartType;
    name: string;
    placeholder: string;
    value: string | undefined;
    setValue: (value: string | undefined) => any;
}

const EmpathyPart = ({
    partType,
    name,
    placeholder,
    value,
    setValue,
}: IProps) => {
    const screenSize = useScreenSize();

    const className =
        partType === EmpathyPartType.TOP_LEFT
            ? 'top_left'
            : partType === EmpathyPartType.TOP_RIGHT
              ? 'top_right'
              : partType === EmpathyPartType.BOTTOM_LEFT
                ? 'bottom_left'
                : 'bottom_right';

    return (
        <div className={`${styles['empathy_part']} ${styles[className]}`}>
            <h5
                className={`${styles['heading']} text-bigger-bold color-gray-800`}>
                {name}
            </h5>
            <div className={styles['content']}>
                <textarea
                    placeholder={placeholder}
                    className={
                        'text-normal color-dark-900 empathy_map_textarea_export_jpg'
                    }
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    maxLength={MAX_EMPATHY_MAP_FIELD_LENGTH}
                />
                <pre
                    className={`text-normal color-dark-900 empathy_map_textarea_export_hidden_jpg`}
                    style={{
                        display: 'none',
                        whiteSpace: 'pre-wrap',
                        width:
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? `calc(100% - 96px)`
                                : `calc(100% - 54px)`,
                        padding: '0 20px',
                        boxSizing: 'border-box',
                        lineHeight: '24px',
                        marginLeft:
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L &&
                            (partType === EmpathyPartType.TOP_RIGHT ||
                                partType === EmpathyPartType.BOTTOM_RIGHT)
                                ? '96px'
                                : partType === EmpathyPartType.TOP_RIGHT ||
                                    partType === EmpathyPartType.BOTTOM_RIGHT
                                  ? '54px'
                                  : 0,
                    }}>
                    {value}
                </pre>
            </div>
        </div>
    );
};

export default EmpathyPart;
