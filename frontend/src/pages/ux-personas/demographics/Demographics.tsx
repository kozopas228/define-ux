import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from './Demographics.module.css';
import AgeInput from './age-input/AgeInput';
import Dropdown from '../../../components/inputs/Dropdown';
import DemographicsInput from './demographics-input/DemographicsInput';
import { UxPersonaDto } from '../types';
import { cloneDeep } from 'lodash';

interface IProps {
    uxPersona: UxPersonaDto;
    setUxPersona: Dispatch<SetStateAction<UxPersonaDto>>;
}

const Demographics = ({ uxPersona, setUxPersona }: IProps) => {
    function handleSetOccupationEnabled(enabled: boolean) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.hasDemographics_occupation = enabled;
            return copiedPersona;
        });
    }
    function handleSetOccupationValue(val: string) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.demographics_occupation = val;
            return copiedPersona;
        });
    }

    function handleSetIncomeEnabled(enabled: boolean) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.hasDemographics_income = enabled;
            return copiedPersona;
        });
    }
    function handleSetIncomeValue(val: string) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.demographics_income = val;
            return copiedPersona;
        });
    }

    function handleSetLocationEnabled(enabled: boolean) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.hasDemographics_location = enabled;
            return copiedPersona;
        });
    }
    function handleSetLocationValue(val: string) {
        setUxPersona((prev) => {
            const copiedPersona = cloneDeep(prev);
            copiedPersona.demographics_location = val;
            return copiedPersona;
        });
    }

    function handleGenderChange(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value.toLowerCase();

        if (value === 'male' || value === 'female' || value === 'other') {
            setUxPersona((prev) => {
                const copiedPersona = cloneDeep(prev);
                copiedPersona.demographics_gender = value;
                return copiedPersona;
            });
        }

        if (value === 'select gender') {
            setUxPersona((prev) => {
                const copiedPersona = cloneDeep(prev);
                copiedPersona.demographics_gender = undefined;
                return copiedPersona;
            });
        }
    }

    return (
        <div className={styles['demographics']}>
            <div
                className={`text-big-bold color-gray-800 ${styles['heading']}`}>
                Demographics
            </div>
            <div className={`${styles['age']}`}>
                <AgeInput
                    uxPersona={uxPersona}
                    setUxPersona={setUxPersona}
                />
                <span className={'text-normal color-dark-900'}>y.o.</span>
            </div>
            <div className={`${styles['select_gender']}`}>
                <Dropdown
                    heading={'Select gender'}
                    options={['Male', 'Female', 'Other']}
                    onChange={handleGenderChange}
                    selectedKey={uxPersona.demographics_gender}
                />
            </div>
            <DemographicsInput
                name={'Occupation'}
                isEnabled={uxPersona.hasDemographics_occupation}
                setIsEnabled={handleSetOccupationEnabled}
                setValue={handleSetOccupationValue}
                value={uxPersona.demographics_occupation}
            />
            <DemographicsInput
                name={'Income'}
                isEnabled={uxPersona.hasDemographics_income}
                setIsEnabled={handleSetIncomeEnabled}
                setValue={handleSetIncomeValue}
                value={uxPersona.demographics_income}
            />
            <DemographicsInput
                name={'Location'}
                isEnabled={uxPersona.hasDemographics_location}
                setIsEnabled={handleSetLocationEnabled}
                setValue={handleSetLocationValue}
                value={uxPersona.demographics_location}
            />
        </div>
    );
};

export default Demographics;
