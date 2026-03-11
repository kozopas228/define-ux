import React, { useEffect, useState } from 'react';
import Modal from '../../../../components/modal/Modal';
import styles from './ChangeProjectModal.module.css';
import TextFieldSecondary from '../../../../components/inputs/TextFieldSecondary';
import TextAreaSecondary from '../../../../components/inputs/TextAreaSecondary';
import ButtonSecondaryOutline from '../../../../components/buttons/ButtonSecondaryOutline';
import ButtonPrimary from '../../../../components/buttons/ButtonPrimary';
import {
    validateDescription,
    validateName,
} from '../../../../utils/validations';
import { saveProject } from '../../../../services/project';

interface IProps {
    isOpen: boolean;
    setIsOpen: any;
    SK: string;
    name: string;
    description?: string;
    setName: any;
    setDescription: any;
}

const ChangeProjectModal = ({
    isOpen,
    setIsOpen,
    name,
    description,
    setName,
    setDescription,
    SK,
}: IProps) => {
    const [formValues, setFormValues] = useState({
        name: name,
        description: description,
    });
    const [nameValidationErrors, setNameValidationErrors] = useState<string[]>(
        []
    );
    const [descriptionValidationErrors, setDescriptionValidationErrors] =
        useState<string[]>([]);

    function handleCancelClick() {
        setIsOpen(false);
        document.body.classList.remove('_lock');
    }

    async function handleSaveClick() {
        if (
            nameValidationErrors.length === 0 &&
            descriptionValidationErrors.length === 0
        ) {
            setName(formValues.name);
            setDescription(formValues.description);
            await saveProject(SK, formValues.name, formValues.description);
            setIsOpen(false);
            document.body.classList.remove('_lock');
        }
    }

    function handleNameChange(e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setFormValues({ ...formValues, name: value });
        const errors = validateName(value);

        setNameValidationErrors(errors);
    }

    function handleDescriptionChange(e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setFormValues({ ...formValues, description: value });
        const errors = validateDescription(value);

        setDescriptionValidationErrors(errors);
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className={styles['change_project_content']}>
            <div className={styles['input_item']}>
                <label className={'text-normal color-dark-900'}>
                    Project name
                </label>
                <TextFieldSecondary
                    onChange={handleNameChange}
                    placeholder={'Enter project name'}
                    value={formValues.name}
                />
            </div>
            <div className={styles['input_item']}>
                <label className={'text-normal color-dark-900'}>
                    Project description
                </label>
                <TextAreaSecondary
                    onChange={handleDescriptionChange}
                    placeholder={'Enter project description'}
                    value={formValues.description}
                />
            </div>
            {(descriptionValidationErrors.length > 0 ||
                nameValidationErrors.length > 0) && (
                <div className={styles['validation_errors']}>
                    {nameValidationErrors.map((err) => (
                        <p
                            className={'color-sinopia-600 text-normal'}
                            key={err}>
                            {err}
                        </p>
                    ))}
                    {descriptionValidationErrors.map((err) => (
                        <p
                            className={'color-sinopia-600 text-normal'}
                            key={err}>
                            {err}
                        </p>
                    ))}
                </div>
            )}
            <div className={styles['buttons']}>
                <ButtonSecondaryOutline onClick={handleCancelClick}>
                    Cancel
                </ButtonSecondaryOutline>
                <ButtonPrimary onClick={handleSaveClick}>Save</ButtonPrimary>
            </div>
        </Modal>
    );
};

export default ChangeProjectModal;
