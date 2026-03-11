import React, { KeyboardEvent } from 'react';
import styles from './ProjectDescriptionInput.module.css';
import EditIcon from '../../../assets/icons/file-edit.svg';
import { ICON_VIEW_BOX, SCREEN_MIN_BOUNDARY_L } from '../../../utils/constants';
import { useScreenSize } from '../../../hooks/useScreenSize';

interface IProps {
    className?: any;
    onChange?: any;
    value?: string;
}

const ProjectDescriptionInput = ({ className, onChange, value }: IProps) => {
    const screenSize = useScreenSize();

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    return (
        <div
            className={`${styles['project_description_input']} ${
                className ?? ''
            }`}>
            <textarea
                className={`${
                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                        ? 'text-big'
                        : 'text-normal'
                } color-dark-900`}
                onChange={onChange}
                placeholder={'Project description (optional)'}
                value={value}
                // maxLength={501}
                onKeyDown={handleKeyDown}></textarea>

            <EditIcon
                className={'search-field-secondary-icon'}
                viewBox={ICON_VIEW_BOX}
            />
        </div>
    );
};

export default ProjectDescriptionInput;
