import React from 'react';
import styles from './ProjectNameInput.module.css';
import EditIcon from '../../../assets/icons/file-edit.svg';
import { ICON_VIEW_BOX, SCREEN_MIN_BOUNDARY_L } from '../../../utils/constants';
import { useScreenSize } from '../../../hooks/useScreenSize';

interface IProps {
    className?: any;
    onChange?: any;
    value?: string;
}

const ProjectNameInput = ({ className, onChange, value }: IProps) => {
    const screenSize = useScreenSize();

    return (
        <div className={`${styles['project_name_input']} ${className ?? ''}`}>
            <input
                className={`${
                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                        ? 'heading3'
                        : 'heading4'
                } color-dark-900`}
                onChange={onChange}
                placeholder={'Enter project name'}
                value={value}
            />

            <EditIcon
                className={'search-field-secondary-icon'}
                viewBox={ICON_VIEW_BOX}
            />
        </div>
    );
};

export default ProjectNameInput;
