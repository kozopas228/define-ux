import React, { useEffect, useState } from "react";
import styles from './ProfilePage.module.css';
import { SCREEN_MIN_BOUNDARY_L } from '../../utils/constants';
import { useScreenSize } from '../../hooks/useScreenSize';
import ButtonSecondary from '../../components/buttons/ButtonSecondary';
import TextFieldSecondaryDisabled from '../../components/inputs/TextFieldSecondaryDisabled';
import ButtonSecondaryOutlineDisabled from '../../components/buttons/ButtonSecondaryOutlineDisabled';
import { validatePassword } from '../../utils/validations';
import PasswordFieldSecondary from '../../components/inputs/PasswordFieldSecondary';
import AlertSuccess from '../../components/alerts/AlertSuccess';
import ButtonOutlineDanger from '../../components/buttons/ButtonOutlineDanger';
import DeleteAccountModal from './delete-account-modal/DeleteAccountModal';
import { useAppSelector } from '../../store/hooks';
import {
    changePassword,
    getAccessToken,
    refreshTokens,
    removeAccessToken,
} from '../../services/auth';
import { AuthMethod } from '../../types/user';

const ProfilePage = () => {
    const screenSize = useScreenSize();

    const user = useAppSelector((state) => state.userReducer.user)!;

    const [isActive, setIsActive] = useState(false);
    const [newPasswordValidationErrors, setNewPasswordValidationErrors] =
        useState<string[]>([]);
    const [repeatPasswordValidationErrors, setRepeatPasswordValidationErrors] =
        useState<string[]>([]);
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [alertIsActive, setAlertIsActive] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
        useState(false);

    // Workaround related to the fact that when navigating from mobile hamburger menu,
    // it doesn't remove _lock class because there's stopPropagation on click
    // from the parent element
    useEffect(() => {
        document.body.classList.remove('_lock');
    }, []);

    function handleNewPasswordChange(e: React.FormEvent<HTMLInputElement>) {
        const password = e.currentTarget.value;
        setNewPassword(password);
    }

    function handleRepeatPasswordChange(e: React.FormEvent<HTMLInputElement>) {
        const password = e.currentTarget.value;
        setRepeatPassword(password);
    }

    function handleChangePasswordClick(e: React.MouseEvent) {
        setIsActive(true);
    }

    async function handleConfirmClick(e: React.MouseEvent) {
        const newPasswordValidationErrors = validatePassword(newPassword);
        setNewPasswordValidationErrors(newPasswordValidationErrors);

        if (newPassword !== repeatPassword) {
            setRepeatPasswordValidationErrors(['Passwords are not the same.']);
        }

        if (
            newPasswordValidationErrors.length === 0 &&
            newPassword === repeatPassword
        ) {
            try {
                const token = getAccessToken();

                await changePassword(token!, newPassword);
            } catch {
                try {
                    await refreshTokens();
                    await changePassword(getAccessToken()!, newPassword);
                } catch {
                    removeAccessToken();
                }
            }
            setAlertIsActive(true);
            setRepeatPasswordValidationErrors([]);
        }
    }

    async function handleDeleteAccountClick() {
        setIsDeleteAccountModalOpen(true);
    }

    return (
        <>
            <div className='container'>
                <div className={`row`}>
                    <div
                        className={`${
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? 'col-l-12'
                                : 'col-s-4'
                        } ${styles['heading']}`}>
                        <h3
                            className={`${
                                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                    ? 'heading3'
                                    : 'heading4'
                            } color-dark-900`}>
                            {user.username}
                        </h3>
                    </div>
                </div>
                <div className='row'>
                    <div
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                ? 'col-l-12'
                                : 'col-s-4'
                        }>
                        <div className={`${styles['logged_in_via']}`}>
                            <span className={'text-big color-gray-700'}>
                                Logged in via:{' '}
                            </span>
                            <span className={'text-big-bold color-dark-900'}>
                                {user.authMethod}
                            </span>
                        </div>
                    </div>
                </div>
                {user.authMethod === AuthMethod.password ? (
                    <>
                        <div className='row'>
                            <div
                                className={
                                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                        ? 'col-l-12'
                                        : 'col-s-4'
                                }>
                                <div
                                    className={`${styles['change_password_button']}`}>
                                    <ButtonSecondary
                                        onClick={handleChangePasswordClick}>
                                        Change password
                                    </ButtonSecondary>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div
                                className={
                                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                        ? 'col-l-12'
                                        : 'col-s-4'
                                }>
                                <div className={`${styles['password_field']}`}>
                                    {isActive ? (
                                        <PasswordFieldSecondary
                                            placeholder={'New password'}
                                            value={newPassword}
                                            onChange={handleNewPasswordChange}
                                        />
                                    ) : (
                                        <TextFieldSecondaryDisabled
                                            placeholder={'New password'}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div
                                className={
                                    screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                        ? 'col-l-12'
                                        : 'col-s-4'
                                }>
                                <div className={`${styles['password_field']}`}>
                                    {isActive ? (
                                        <PasswordFieldSecondary
                                            placeholder={'Repeat password'}
                                            value={repeatPassword}
                                            onChange={
                                                handleRepeatPasswordChange
                                            }
                                        />
                                    ) : (
                                        <TextFieldSecondaryDisabled
                                            placeholder={'Repeat password'}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    ''
                )}
                {(newPasswordValidationErrors.length > 0 ||
                    repeatPasswordValidationErrors.length > 0) && (
                    <div className='row'>
                        <div
                            className={`${
                                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                    ? 'col-l-12'
                                    : 'col-s-4'
                            } ${styles['validation_errors']}`}>
                            {newPasswordValidationErrors.map((ve) => (
                                <p
                                    key={ve}
                                    className={'text-normal color-sinopia-600'}>
                                    {ve}
                                </p>
                            ))}
                            {repeatPasswordValidationErrors.map((ve) => (
                                <p
                                    key={ve}
                                    className={'text-normal color-sinopia-600'}>
                                    {ve}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {user.authMethod === AuthMethod.password ? (
                    <div className='row'>
                        <div
                            className={
                                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                    ? 'col-l-12'
                                    : 'col-s-4'
                            }>
                            <div className={`${styles['confirm_button']}`}>
                                {isActive ? (
                                    <ButtonSecondary
                                        onClick={handleConfirmClick}>
                                        Confirm
                                    </ButtonSecondary>
                                ) : (
                                    <ButtonSecondaryOutlineDisabled>
                                        Confirm
                                    </ButtonSecondaryOutlineDisabled>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}

                <div className={`${styles['delete_account_button']}`}>
                    <div className='row'>
                        <div
                            className={
                                screenSize.width >= SCREEN_MIN_BOUNDARY_L
                                    ? 'col-l-12'
                                    : 'col-s-4'
                            }>
                            <ButtonOutlineDanger
                                onClick={handleDeleteAccountClick}>
                                Delete Account
                            </ButtonOutlineDanger>
                        </div>
                    </div>
                </div>
            </div>

            <AlertSuccess
                isActive={alertIsActive}
                setIsActive={setAlertIsActive}>
                Password Changed Successfully!
            </AlertSuccess>
            <DeleteAccountModal
                isOpen={isDeleteAccountModalOpen}
                setIsOpen={setIsDeleteAccountModalOpen}
            />
        </>
    );
};

export default ProfilePage;
