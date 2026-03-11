import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './CompetitorName.module.css';
import { CompetitorResponseDto, CriteriaResponseDto } from '../../types';
import { cloneDeep } from 'lodash';
import { SCREEN_MIN_BOUNDARY_L } from '../../../../utils/constants';
import { useScreenSize } from '../../../../hooks/useScreenSize';

interface IProps {
    competitor: CompetitorResponseDto;
    className?: string;
    setData: Dispatch<SetStateAction<CompetitorResponseDto[]>>;
}

const CompetitorName = ({ competitor, className, setData }: IProps) => {
    const [value, setValue] = useState(competitor.name);
    const [isActive, setIsActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const screenSize = useScreenSize();

    useEffect(() => {
        inputRef.current?.focus();
    }, [isActive]);

    useEffect(() => {
        setValue(competitor.name);
    }, [competitor]);

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

            if (copiedComp) {
                copiedComp.name = value;
            }

            return copiedArray;
        });
    }

    function handleSetActive() {
        setIsActive(true);
    }

    return (
        <td
            className={`${styles['competitor_name']} ${className} ${
                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                    ? 'text-normal-bold color-dark-900'
                    : 'text-small-bold color-dark-900'
            } competitor_name_export_jpg`}>
            {isActive ? (
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    ref={inputRef}
                    maxLength={300}
                />
            ) : (
                <div onClick={handleSetActive}>
                    {value.trim() === '' ? '-' : value}
                </div>
            )}
        </td>
    );
};

export default CompetitorName;
