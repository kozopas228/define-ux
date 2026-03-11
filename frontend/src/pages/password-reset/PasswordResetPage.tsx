import React, { useState } from 'react';
import styles from './PasswordResetPage.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordFieldSecondary from '../../components/inputs/PasswordFieldSecondary';
import PasswordFieldDanger from '../../components/inputs/PasswordFieldDanger';
import { validatePassword } from '../../utils/validations';
import ButtonPrimary from '../../components/buttons/ButtonPrimary';
import ButtonPrimaryDisabled from '../../components/buttons/ButtonPrimaryDisabled';
import AlertSuccess from '../../components/alerts/AlertSuccess';
import AlertDanger from '../../components/alerts/AlertDanger';
import { resetPassword } from '../../services/auth';

const PasswordResetPage = () => {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState<string>();
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isAlertSuccessActive, setIsAlertSuccessActive] = useState(false);
    const [isAlertDangerActive, setIsAlertDangerActive] = useState(false);

    const [searchParams, _] = useSearchParams();

    function handlePasswordChange(e: React.FormEvent<HTMLInputElement>) {
        setNewPassword(e.currentTarget.value);

        const validationErrors = validatePassword(e.currentTarget.value);
        setValidationErrors(validationErrors);
    }

    async function handleSubmit() {
        const token = searchParams.get('token');
        const userPK =
            searchParams.get('userPK') +
            '#' +
            window.location.href.split('#')[1];
        if (!token || !userPK || !newPassword) {
            setIsAlertDangerActive(true);
            return;
        }

        try {
            await resetPassword(userPK, token, newPassword);
            setIsAlertSuccessActive(true);
            setTimeout(() => {
                navigate('/');
                location.reload();
            }, 3000);
        } catch (e) {
            setIsAlertDangerActive(true);
        }
    }

    return (
        <>
            <div className='container'>
                <div className={`row`}>
                    <div className={`${styles['restore_form']}`}>
                        <h3 className={'heading3 color-gray-800'}>
                            Restore password
                        </h3>
                        <div
                            className={`${styles['text_input']} ${styles['password_input']}`}>
                            {validationErrors.length <= 0 ? (
                                <PasswordFieldSecondary
                                    placeholder={'Enter new password'}
                                    onChange={handlePasswordChange}
                                    value={newPassword}
                                    autofocus={true}
                                    className={styles['password_field']}
                                />
                            ) : (
                                <PasswordFieldDanger
                                    placeholder={'Enter new password'}
                                    onChange={handlePasswordChange}
                                    value={newPassword}
                                    autofocus={true}
                                    className={styles['password_field']}
                                />
                            )}
                        </div>
                        {validationErrors.length > 0 && (
                            <div className={styles['validation_errors']}>
                                {validationErrors.map((err) => (
                                    <p
                                        key={err}
                                        className={
                                            'color-sinopia-600 text-normal'
                                        }>
                                        {err}
                                    </p>
                                ))}
                            </div>
                        )}
                        {validationErrors.length > 0 ? (
                            <ButtonPrimaryDisabled
                                className={styles['submit_button']}>
                                Submit
                            </ButtonPrimaryDisabled>
                        ) : (
                            <ButtonPrimary
                                onClick={handleSubmit}
                                className={styles['submit_button']}>
                                Submit
                            </ButtonPrimary>
                        )}
                    </div>
                </div>
            </div>
            <AlertSuccess
                isActive={isAlertSuccessActive}
                setIsActive={setIsAlertSuccessActive}>
                Password has been successfully restored
            </AlertSuccess>
            <AlertDanger
                isActive={isAlertDangerActive}
                setIsActive={setIsAlertDangerActive}>
                Error has happened during password restoration
            </AlertDanger>
        </>
    );
};

export default PasswordResetPage;
