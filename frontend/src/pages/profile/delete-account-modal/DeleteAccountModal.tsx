import React from 'react';
import Modal from '../../../components/modal/Modal';
import styles from './DeleteAccountModal.module.css';
import ButtonSecondaryOutline from '../../../components/buttons/ButtonSecondaryOutline';
import ButtonOutlineDanger from '../../../components/buttons/ButtonOutlineDanger';
import {
    deleteAccount,
    getAccessToken,
    refreshTokens,
    removeAccessToken,
    setAccessToken,
} from '../../../services/auth';

interface IProps {
    isOpen: boolean;
    setIsOpen: any;
}

const DeleteAccountModal = ({ isOpen, setIsOpen }: IProps) => {
    function handleCancelClick() {
        setIsOpen(false);
        document.body.classList.remove('_lock');
    }

    async function handleDeleteAccountClick() {
        try {
            const token = getAccessToken();

            await deleteAccount(token!);
        } catch {
            try {
                const newToken = await refreshTokens();
                setAccessToken(newToken);
                await deleteAccount(newToken!);
            } catch {
                removeAccessToken();
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className={styles['delete_account_modal']}>
            <b className={'text-big-bold color-dark-900'}>
                Are you sure you want to delete your account?
            </b>
            <p className={'text-normal-bold color-sinopia-600'}>
                By now this operation in permanent
            </p>
            <div className={styles['buttons']}>
                <ButtonSecondaryOutline onClick={handleCancelClick}>
                    Cancel
                </ButtonSecondaryOutline>
                <ButtonOutlineDanger onClick={handleDeleteAccountClick}>
                    Delete account
                </ButtonOutlineDanger>
            </div>
        </Modal>
    );
};

export default DeleteAccountModal;
