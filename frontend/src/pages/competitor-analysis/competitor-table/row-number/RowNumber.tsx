import React from 'react';
import styles from './RowNumber.module.css';
import { SCREEN_MIN_BOUNDARY_L } from '../../../../utils/constants';
import { useScreenSize } from '../../../../hooks/useScreenSize';

interface IProps {
    rowNumber: number;
    className?: string;
}

const RowNumber = ({ rowNumber, className }: IProps) => {
    const screenSize = useScreenSize();

    return (
        <td className={`${styles['row_number']} ${className} row_number_export_jpg`}>
            <h4
                className={
                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                        ? 'text-bigger-bold color-gray-700'
                        : 'text-normal-bold color-gray-700'
                }>
                {rowNumber}
            </h4>
        </td>
    );
};

export default RowNumber;
