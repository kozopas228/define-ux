import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './Resizer.module.css';
import {
    DEFAULT_COLUMN_WIDTH_L,
    DEFAULT_COLUMN_WIDTH_S,
    MIN_COLUMN_WIDTH_L,
    MIN_COLUMN_WIDTH_S,
    SCREEN_MIN_BOUNDARY_L,
} from '../../../../utils/constants';
import { useScreenSize } from '../../../../hooks/useScreenSize';

type columnWidthsType = { [key: string]: number };

interface IProps {
    criteriaId: string;
    columnWidths: columnWidthsType;
    setColumnWidths: Dispatch<SetStateAction<columnWidthsType>>;
}

const Resizer = ({ criteriaId, columnWidths, setColumnWidths }: IProps) => {
    const [startX, setStartX] = useState(0);
    const [resizingCriteria, setResizingCriteria] = useState('');

    const screenSize = useScreenSize();

    const MIN_COLUMN_WIDTH =
        screenSize.width >= SCREEN_MIN_BOUNDARY_L
            ? MIN_COLUMN_WIDTH_L
            : MIN_COLUMN_WIDTH_S;

    const DEFAULT_COLUMN_WIDTH =
        screenSize.width >= SCREEN_MIN_BOUNDARY_L
            ? DEFAULT_COLUMN_WIDTH_L
            : DEFAULT_COLUMN_WIDTH_S;

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (resizingCriteria) {
                const newWidth = Math.max(
                    MIN_COLUMN_WIDTH,
                    (columnWidths[criteriaId] || DEFAULT_COLUMN_WIDTH) +
                        (e.clientX - startX)
                );
                setColumnWidths((prev: columnWidthsType) => ({
                    ...prev,
                    [resizingCriteria]: newWidth,
                }));
                setStartX(e.clientX); // updating startX for the smooth dragging
            }
        };

        const onMouseUp = () => {
            setResizingCriteria('');
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [
        startX,
        resizingCriteria,
        columnWidths,
        criteriaId,
        setColumnWidths,
        MIN_COLUMN_WIDTH,
        DEFAULT_COLUMN_WIDTH,
    ]);

    function handleResizerMouseDown(e: React.MouseEvent, criteriaId: string) {
        setStartX(e.clientX);
        setResizingCriteria(criteriaId);
    }

    return (
        <div
            className={styles['resizer']}
            onMouseDown={(e) => handleResizerMouseDown(e, criteriaId)}></div>
    );
};

export default Resizer;
