import React, { Dispatch, SetStateAction } from 'react';
import styles from './RemoveRowButton.module.css';
import CrossCircleIcon from '../../../../assets/icons/cross-circle.svg';
import { CompetitorResponseDto } from '../../types';
import { UUID } from '../../../../engine/types/Uuid';

interface IProps {
    competitorId: UUID;
    className: string;
    setData: Dispatch<SetStateAction<CompetitorResponseDto[]>>;
}

const RemoveRowButton = ({ className, setData, competitorId }: IProps) => {
    function handleClick() {
        setData((prev) => [...prev.filter((comp) => comp.id !== competitorId)]);
    }

    return (
        <td
            className={`${className} ${styles['remove_row_button']} remove_row_button_export_jpg`}>
            <CrossCircleIcon onClick={handleClick} />
        </td>
    );
};

export default RemoveRowButton;
