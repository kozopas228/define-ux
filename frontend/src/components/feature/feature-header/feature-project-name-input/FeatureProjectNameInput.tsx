import React from 'react';
import styles from './FeatureProjectNameInput.module.css';
import EditIcon from '../../../../assets/icons/file-edit.svg';
import { useScreenSize } from '../../../../hooks/useScreenSize';
import {
    ICON_VIEW_BOX,
    SCREEN_MIN_BOUNDARY_L,
} from '../../../../utils/constants';

interface IProps {
    className?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
    value?: string;
    projectType: string;
}

const FeatureProjectNameInput = ({
    className,
    onChange,
    value,
    projectType,
}: IProps) => {
    const screenSize = useScreenSize();

    return (
        <div
            className={`${styles['feature_project_name_input']} ${
                className ?? ''
            }`}>
            <input
                className={`${
                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                        ? 'text-bigger-bold'
                        : 'text-big-bold'
                } color-dark-900`}
                onChange={onChange}
                placeholder={`${projectType} name`}
                value={value}
            />

            <EditIcon
                className={'search-field-secondary-icon'}
                viewBox={ICON_VIEW_BOX}
            />
        </div>
    );
};

export default FeatureProjectNameInput;
