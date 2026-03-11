import React, { Dispatch, SetStateAction, useState } from 'react';
import { useScreenSize } from '../../../hooks/useScreenSize';
import { SCREEN_MIN_BOUNDARY_L } from '../../../utils/constants';
import styles from './FeatureHeader.module.css';
import FeatureProjectNameInput from './feature-project-name-input/FeatureProjectNameInput';
import ButtonPrimary from '../../buttons/ButtonPrimary';
import ButtonSecondary from '../../buttons/ButtonSecondary';
import ExportIcon from '../../../assets/icons/file-export.svg';
import AlertSuccess from '../../alerts/AlertSuccess';
import { useAppSelector } from '../../../store/hooks';
import ButtonOutlineDanger from '../../buttons/ButtonOutlineDanger';
import BucketIcon from '../../../assets/icons/pomoyka.svg';
import ButtonPrimaryDisabled from '../../buttons/ButtonPrimaryDisabled';
import FeatureDeleteModal from './feature-delete-modal/FeatureDeleteModal';
import AlertDanger from '../../alerts/AlertDanger';

interface IProps {
    projectName: string;
    projectType: string;
    featureHeading?: string;
    handleExport: any;
    handleSave: () => Promise<any>;
    setFeatureHeading: Dispatch<SetStateAction<string>>;
    handleProjectNameClick: () => any;
    isDataSaved: boolean;
    handleDelete: () => any;
}

const FeatureHeader = ({
    projectName,
    projectType,
    featureHeading,
    handleExport,
    handleSave,
    setFeatureHeading,
    handleProjectNameClick,
    isDataSaved,
    handleDelete,
}: IProps) => {
    const screenSize = useScreenSize();

    const user = useAppSelector((state) => state.userReducer.user);

    const [isAlertSuccessActive, setIsAlertSuccessActive] = useState(false);
    const [isAlertDangerActive, setIsAlertDangerActive] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [validationErrors, setValidationErrors] = useState<string>();

    async function handleSaveClick() {
        setIsSaving(true);
        try {
            await handleSave();
            setIsAlertSuccessActive(true);
        } catch (e) {
            setIsAlertDangerActive(true);
        }
        setIsSaving(false);
    }

    function handleExportClick() {
        handleExport();
    }

    function handleDeleteClick() {
        setIsDeleteModalOpen(true);
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFeatureHeading(e.target.value);

        if (!e.target.value) {
            setValidationErrors('Name should not be empty');
        } else if (e.target.value.length > 100) {
            setValidationErrors('Name should be less than 100 characters');
        } else {
            setValidationErrors(undefined);
        }
    }

    const layoutL = (
        <>
            {user && (
                <p
                    onClick={handleProjectNameClick}
                    className={`${styles['project_name']} text-bigger-bold color-blue-700`}>
                    ← {projectName}
                </p>
            )}
            <p
                className={`${styles['project_type']} text-normal color-dark-900`}>
                {projectType}
            </p>
            <div className={`${styles['project_name_input']}`}>
                <FeatureProjectNameInput
                    value={featureHeading}
                    onChange={handleNameChange}
                    projectType={projectType}
                />
                <p className={'text-normal color-sinopia-600'}>{validationErrors}</p>
            </div>
            <div className={`${styles['buttons']} `}>
                {user && (
                    <div className={`${styles['save_button']} col-l-2`}>
                        {!isSaving ? (
                            <ButtonPrimary onClick={handleSaveClick}>
                                Save
                            </ButtonPrimary>
                        ) : (
                            <ButtonPrimaryDisabled>
                                Saving...
                            </ButtonPrimaryDisabled>
                        )}
                    </div>
                )}

                <ButtonSecondary
                    className={`${styles['export_button']}`}
                    onClick={handleExportClick}>
                    Export in JPEG <ExportIcon />
                </ButtonSecondary>
                {user && (
                    <ButtonOutlineDanger
                        className={`${styles['delete_button']}`}
                        onClick={handleDeleteClick}>
                        <BucketIcon />
                    </ButtonOutlineDanger>
                )}
                {user && !isDataSaved && (
                    <b
                        className={`text-normal-bold color-sinopia-600 ${styles['unsaved_text']}`}>
                        Unsaved*
                    </b>
                )}
            </div>
            <AlertSuccess
                isActive={isAlertSuccessActive}
                setIsActive={setIsAlertSuccessActive}>
                Saved Successfully
            </AlertSuccess>
            <AlertDanger
                isActive={isAlertDangerActive}
                setIsActive={setIsAlertDangerActive}>
                Error has happened during saving
            </AlertDanger>
            <FeatureDeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                name={featureHeading}
                handleDelete={handleDelete}
            />
        </>
    );

    const layoutS = (
        <>
            {user && (
                <div className='row'>
                    <div className='col-s-4'>
                        <p
                            onClick={handleProjectNameClick}
                            className={`${styles['project_name']} text-bigger-bold color-blue-700`}>
                            ← {projectName}
                        </p>
                    </div>
                </div>
            )}
            <div className='row'>
                <div className='col-s-4'>
                    <p
                        className={`${styles['project_type']} text-normal color-dark-900`}>
                        {projectType}
                    </p>
                </div>
            </div>
            <div className='row'>
                <div className='col-s-4'>
                    <div className={`${styles['project_name_input']}`}>
                        <FeatureProjectNameInput
                            value={featureHeading}
                            onChange={handleNameChange}
                            projectType={projectType}
                        />
                      <p className={'text-normal color-sinopia-600'}>{validationErrors}</p>
                    </div>
                </div>
            </div>
            <div className={`row`}>
                <div className={`col-s-4`}>
                    <div className={`${styles['buttons_top_mobile']}`}>
                        {user && (
                            <div className={`${styles['save_button']}`}>
                                {!isSaving ? (
                                    <ButtonPrimary onClick={handleSaveClick}>
                                        Save
                                    </ButtonPrimary>
                                ) : (
                                    <ButtonPrimaryDisabled>
                                        Saving...
                                    </ButtonPrimaryDisabled>
                                )}
                            </div>
                        )}
                        <ButtonSecondary
                            className={`${styles['export_button']}`}
                            onClick={handleExportClick}>
                            Export in JPEG <ExportIcon />
                        </ButtonSecondary>
                    </div>
                </div>
            </div>
            <div className={`row`}>
                <div className={`col-s-4`}>
                    <div className={`${styles['buttons']}`}>
                        {user && (
                            <ButtonOutlineDanger
                                className={`${styles['delete_button']}`}
                                onClick={handleDeleteClick}>
                                <BucketIcon />
                            </ButtonOutlineDanger>
                        )}
                        {user && !isDataSaved && (
                            <b
                                className={`text-normal-bold color-sinopia-600 ${styles['unsaved_text']}`}>
                                Unsaved*
                            </b>
                        )}
                    </div>
                </div>
            </div>
            <AlertSuccess
                isActive={isAlertSuccessActive}
                setIsActive={setIsAlertSuccessActive}>
                Saved Successfully
            </AlertSuccess>
            <AlertDanger
                isActive={isAlertDangerActive}
                setIsActive={setIsAlertDangerActive}>
                Error has happened during saving
            </AlertDanger>
            <FeatureDeleteModal
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                name={featureHeading}
                handleDelete={handleDelete}
            />
        </>
    );

    return screenSize.width >= SCREEN_MIN_BOUNDARY_L ? layoutL : layoutS;
};

export default FeatureHeader;
