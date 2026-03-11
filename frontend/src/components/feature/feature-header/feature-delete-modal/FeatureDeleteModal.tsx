import React, { useEffect, useState } from 'react';
import Modal from '../../../../components/modal/Modal';
import TextFieldSecondary from '../../../../components/inputs/TextFieldSecondary';
import TextAreaSecondary from '../../../../components/inputs/TextAreaSecondary';
import ButtonSecondaryOutline from '../../../../components/buttons/ButtonSecondaryOutline';
import ButtonPrimary from '../../../../components/buttons/ButtonPrimary';
import ButtonOutlineDanger from '../../../../components/buttons/ButtonOutlineDanger';
import styles from './FeatureDeleteModal.module.css';

interface IProps {
    isOpen: boolean;
    setIsOpen: any;
    name?: string;
    handleDelete: any;
}

const FeatureDeleteModal = ({
    isOpen,
    setIsOpen,
    name,
    handleDelete,
}: IProps) => {
    function handleCancelClick() {
        setIsOpen(false);
        document.body.classList.remove('_lock');
    }

    function handleDeleteClick() {
        setIsOpen(false);
        document.body.classList.remove('_lock');
        handleDelete();
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className={styles['delete_feature_content']}>
            <p className={`color-dark-900 text-big-bold`}>
                Are you sure you want to delete?
            </p>
            <h4 className={`color-gray-700 text-bigger`}>{name}</h4>
            <div className={styles['buttons']}>
                <ButtonSecondaryOutline onClick={handleCancelClick}>
                    Cancel
                </ButtonSecondaryOutline>
                <ButtonOutlineDanger onClick={handleDeleteClick}>
                    Delete
                </ButtonOutlineDanger>
            </div>
        </Modal>
    );
};

export default FeatureDeleteModal;
