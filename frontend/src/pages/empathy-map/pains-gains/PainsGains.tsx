import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import styles from './PainsGains.module.css';
import { EmpathyMap } from '../../../types/empathyMap';
import { cloneDeep } from 'lodash';

interface IProps {
    empathyMap: EmpathyMap;
    setEmpathyMap: Dispatch<SetStateAction<EmpathyMap>>;
}

const PainsGains = ({ empathyMap, setEmpathyMap }: IProps) => {
    function handlePainsOnInput() {}
    function handleGainsOnInput() {}

    function handlePainsChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setEmpathyMap((prev) => {
            const copiedEmpathyMap = cloneDeep(prev);

            copiedEmpathyMap.pains = e.target.value;

            return copiedEmpathyMap;
        });
    }

    function handleGainsChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setEmpathyMap((prev) => {
            const copiedEmpathyMap = cloneDeep(prev);

            copiedEmpathyMap.gains = e.target.value;

            return copiedEmpathyMap;
        });
    }

    return (
        <div className={styles['pains_gains']}>
            <div className={styles['pains']}>
                <p className={`text-bigger-bold color-gray-800`}>Pains</p>
                <textarea
                    className={`color-dark-900 text-normal empathy_map_textarea_export_jpg`}
                    value={empathyMap.pains}
                    placeholder={`What are their fears, frustrations and challenges?`}
                    onInput={handlePainsOnInput}
                    maxLength={300}
                    onChange={handlePainsChange}
                />
                <pre
                    className={`text-normal color-dark-900 empathy_map_textarea_export_hidden_jpg`}
                    style={{
                        display: 'none',
                        width: '100%',
                        overflow: 'hidden',
                        textWrap: 'wrap',
                        whiteSpace: 'pre-wrap',
                        boxSizing: 'border-box',
                        marginTop: 16,
                        padding: '0 20px',
                        lineHeight: '24px',
                    }}>
                    {empathyMap.pains}
                </pre>
            </div>
            <div className={styles['gains']}>
                <p className={`text-bigger-bold color-gray-800`}>Gains</p>
                <textarea
                    className={`color-dark-900 text-normal empathy_map_textarea_export_jpg`}
                    value={empathyMap.gains}
                    placeholder={`What are their needs, hopes and dreams?\nWhat makes them happy?`}
                    onInput={handleGainsOnInput}
                    maxLength={300}
                    onChange={handleGainsChange}
                />
                <pre
                    className={`text-normal color-dark-900 empathy_map_textarea_export_hidden_jpg`}
                    style={{
                        display: 'none',
                        width: '100%',
                        overflow: 'hidden',
                        textWrap: 'wrap',
                        whiteSpace: 'pre-wrap',
                        boxSizing: 'border-box',
                        marginTop: 16,
                        padding: '0 20px',
                        lineHeight: '24px',
                    }}>
                    {empathyMap.gains}
                </pre>
            </div>
        </div>
    );
};

export default PainsGains;
