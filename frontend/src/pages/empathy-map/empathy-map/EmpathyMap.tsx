import React, { Dispatch, SetStateAction } from 'react';
import styles from './EmpathyMap.module.css';
import EmpathyPart from './empathy-part/EmpathyPart';
import { EmpathyPartType } from '../types';
import EmpathyCenterBall from './empathy-center-ball/EmpathyCenterBall';
import { EmpathyMap as EmpathyMapEntity } from '../../../types/empathyMap';
import { cloneDeep } from 'lodash';
import { UxPersona } from '../../../types/uxPersona';

interface IProps {
    empathyMap: EmpathyMapEntity;
    setEmpathyMap: Dispatch<SetStateAction<EmpathyMapEntity>>;
    personas: UxPersona[];
    chosenPersona: UxPersona | undefined;
    setChosenPersona: Dispatch<SetStateAction<UxPersona | undefined>>;
}

const EmpathyMap = ({
    empathyMap,
    setEmpathyMap,
    personas,
    setChosenPersona,
    chosenPersona,
}: IProps) => {
    function setSays(says: string | undefined) {
        setEmpathyMap((prev) => {
            const copiedEmpathyMap = cloneDeep(prev);

            copiedEmpathyMap.says = says;

            return copiedEmpathyMap;
        });
    }

    function setDoes(does: string | undefined) {
        setEmpathyMap((prev) => {
            const copiedEmpathyMap = cloneDeep(prev);

            copiedEmpathyMap.does = does;

            return copiedEmpathyMap;
        });
    }

    function setThinks(thinks: string | undefined) {
        setEmpathyMap((prev) => {
            const copiedEmpathyMap = cloneDeep(prev);

            copiedEmpathyMap.thinks = thinks;

            return copiedEmpathyMap;
        });
    }

    function setFeels(feels: string | undefined) {
        setEmpathyMap((prev) => {
            const copiedEmpathyMap = cloneDeep(prev);
            copiedEmpathyMap.feels = feels;

            return copiedEmpathyMap;
        });
    }

    return (
        <div className={styles['empathy_map']}>
            <EmpathyPart
                partType={EmpathyPartType.TOP_LEFT}
                name={'Says'}
                placeholder={
                    'What have we heard them say?\nHow do they behave towards others?'
                }
                value={empathyMap.says}
                setValue={setSays}
            />
            <EmpathyPart
                partType={EmpathyPartType.TOP_RIGHT}
                name={'Does'}
                placeholder={
                    'What do they do daily?\nWhat their unique behavior?'
                }
                value={empathyMap.does}
                setValue={setDoes}
            />
            <EmpathyPart
                partType={EmpathyPartType.BOTTOM_LEFT}
                name={'Thinks'}
                placeholder={
                    'What are they worried about?\nWhat are they excited about?\nWhat are they thinking about?'
                }
                value={empathyMap.thinks}
                setValue={setThinks}
            />
            <EmpathyPart
                partType={EmpathyPartType.BOTTOM_RIGHT}
                name={'Feels'}
                placeholder={'How do they feel on daily basis?'}
                value={empathyMap.feels}
                setValue={setFeels}
            />
            <EmpathyCenterBall
                personas={personas}
                chosenPersona={chosenPersona}
                setChosenPersona={setChosenPersona}
            />
        </div>
    );
};

export default EmpathyMap;
