import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './CriteriaValueComponent.module.css';
import { CompetitorResponseDto, CriteriaResponseDto, CriteriaValueResponseDto } from '../../types';
import CriteriaCheckbox from './criteria-checkbox/CriteriaCheckbox';
import { cloneDeep } from 'lodash';
import { SCREEN_MIN_BOUNDARY_L } from '../../../../utils/constants';
import { useScreenSize } from '../../../../hooks/useScreenSize';

interface IProps {
    competitor: CompetitorResponseDto;
    criteria: CriteriaResponseDto;
    className?: string;
    setData: Dispatch<SetStateAction<CompetitorResponseDto[]>>;
}

const CriteriaValueComponent = ({
    criteria,
    className,
    setData,
    competitor,
}: IProps) => {
    const [value, setValue] = useState(criteria.value?.value);
    const [isActive, setIsActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const screenSize = useScreenSize();

    useEffect(() => {
        inputRef.current?.focus();
    }, [isActive]);

    useEffect(() => {
        setValue(criteria.value?.value);
    }, [criteria]);

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

    function onBlur() {
        setIsActive(false);

        setData((prev) => {
            const copiedArray = cloneDeep(prev);
            const copiedComp = copiedArray.find((c) => c.id === competitor.id);
            const copiedCrit = copiedComp?.criterias.find(
                (cr) => cr.id === criteria.id
            );

            if (copiedCrit) {
                copiedCrit.value!.value = value as string;
            }

            return copiedArray;
        });
    }

    function handleSetActive() {
        setIsActive(true);
    }

    return (
        <td
            className={`${className} ${styles['criteria_value']} ${
                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                    ? 'text-normal color-dark-900'
                    : 'text-small color-dark-900'
            }`}>
            {criteria.type === 'boolean' ? (
                <CriteriaCheckbox
                    value={value as boolean}
                    setValue={setValue}
                    setData={setData}
                    criteria={criteria}
                    competitor={competitor}
                />
            ) : isActive ? (
                <input
                    type={'text'}
                    value={String(value)}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    ref={inputRef}
                    maxLength={300}
                />
            ) : (
                <div onClick={handleSetActive}>
                    {String(value).trim() === '' ? '-' : value}
                </div>
            )}
        </td>
    );
};

export default CriteriaValueComponent;
