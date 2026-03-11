import React, { useEffect, useState } from 'react';
import styles from './SignUpModal.module.css';
import LogoSmall from '../../../assets/icons/logo-small.svg';
import TextFieldSecondary from '../../inputs/TextFieldSecondary';
import ButtonPrimary from '../../buttons/ButtonPrimary';
import GoogleLogo from '../../../assets/images/google-logo.png';
import FacebookLogo from '../../../assets/images/facebook-logo.png';
import ButtonPrimaryDisabled from '../../buttons/ButtonPrimaryDisabled';
import { emailPattern, passwordPattern } from '../../../utils/patterns';
import TextFieldDanger from '../../inputs/TextFieldDanger';
import TextFieldSecondaryDisabled from '../../inputs/TextFieldSecondaryDisabled';
import PasswordFieldSecondary from '../../inputs/PasswordFieldSecondary';
import PasswordFieldDanger from '../../inputs/PasswordFieldDanger';
import Modal from '../../modal/Modal';
import {
    requestPasswordReset,
    setAccessToken,
    signIn,
    signUp,
} from '../../../services/auth';
import { useAppDispatch } from '../../../store/hooks';

interface IProps {
    isOpen: boolean;
    setIsOpen: any;
    disableBodyLock?: boolean;
}

enum SignUpModalState {
    init,
    registerEmailSuccessful,
    login,
    restorePassword,
}

const SignUpModal = ({ isOpen, setIsOpen, disableBodyLock }: IProps) => {
    const dispatch = useAppDispatch();

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });
    const [signUpState, setSignUpState] = useState<SignUpModalState>(
        SignUpModalState.init
    );

    const [isRestorationMailSent, setIsRestorationMailSent] =
        useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) {
            setValidationErrors([]);
            setFormValues({
                email: '',
                password: '',
            });
            setSignUpState(SignUpModalState.init);
        }
    }, [isOpen]);

    function handleEmailChange(e: React.FormEvent<HTMLInputElement>) {
        setFormValues({ ...formValues, email: e.currentTarget.value });
        if (validateEmail(e.currentTarget.value)) {
            setValidationErrors([]);
        }
    }

    function handlePasswordChange(e: React.FormEvent<HTMLInputElement>) {
        setFormValues({ ...formValues, password: e.currentTarget.value });
        if (validatePassword(e.currentTarget.value)) {
            setValidationErrors([]);
        }
    }

    function handleContinue() {
        if (!validateEmail(formValues.email)) {
            setValidationErrors([...validationErrors, 'wrong email pattern']);
        } else {
            setSignUpState(SignUpModalState.registerEmailSuccessful);
        }
    }

    async function handleCreateAccount() {
        if (!validatePassword(formValues.password)) {
            setValidationErrors([
                ...validationErrors,
                'password should contain at least one upper case letter, ' +
                    'one lower case letter and number or special character ',
            ]);
        } else {
            try {
                await signUp(formValues.email, formValues.password);
                const access_token = await signIn(
                    formValues.email,
                    formValues.password
                );

                localStorage.setItem('access_token', access_token);
                location.reload();
            } catch (e) {
                setValidationErrors([e.message]);
            }
        }
    }

    function validateEmail(email: string): boolean {
        return email.match(emailPattern) !== null;
    }

    function validatePassword(password: string): boolean {
        return password.match(passwordPattern) !== null;
    }

    function handleGoogleOauthClick() {
        const googleOauthUrl = process.env.GOOGLE_OAUTH_URL;
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

        const googleOauthScopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' ');

        const state = 'some_state';
        // eslint-disable-next-line max-len
        const googleOauthConsentUrl = `${googleOauthUrl}?client_id=${googleClientId}&redirect_uri=${googleCallbackUrl}&access_type=offline&response_type=code&state=${state}&scope=${googleOauthScopes}`;
        window.location.href = googleOauthConsentUrl;
    }

    function handleFacebookOauthClick() {
        // localStorage.setItem('isSignedIn', 'true');
        location.reload();
    }

    function handleLoginLinkClick() {
        setValidationErrors([]);
        setSignUpState(SignUpModalState.login);
    }

    function handleSignUpLinkClick() {
        setValidationErrors([]);
        setSignUpState(SignUpModalState.init);
    }

    async function handleLoginButtonClick() {
        if (!formValues.password || !formValues.email) {
            setValidationErrors(['One or more fields are empty.']);
        } else {
            try {
                const access_token = await signIn(
                    formValues.email,
                    formValues.password
                );

                setAccessToken(access_token);
                location.reload();
            } catch (e) {
                setValidationErrors([e.message]);
            }
        }
    }

    function handleForgotPasswordLinkClick() {
        setValidationErrors([]);
        setSignUpState(SignUpModalState.restorePassword);
    }

    async function handleSendRestorationButtonClick() {
        if (!validateEmail(formValues.email)) {
            setValidationErrors(['Wrong email pattern']);
        } else {
            setIsRestorationMailSent(true);

            setTimeout(() => {
                setIsRestorationMailSent(false);
            }, 2000);

            await requestPasswordReset(formValues.email);
        }
    }

    let layout: React.JSX.Element | undefined;
    let bottomMessageLayout: React.JSX.Element | undefined;
    if (signUpState === SignUpModalState.init) {
        layout = (
            <>
                <div className={styles['heading']}>
                    <h3 className={'heading4 color-gray-800'}>
                        Create your account
                    </h3>
                </div>
                <div className={styles['text_input']}>
                    <label className={'text-normal color-dark-900'}>
                        Email
                    </label>
                    {validationErrors.length > 0 ? (
                        <TextFieldDanger
                            placeholder={'sample@gmail.com'}
                            onChange={handleEmailChange}
                            value={formValues.email}
                            type={'email'}
                        />
                    ) : (
                        <TextFieldSecondary
                            placeholder={'sample@gmail.com'}
                            onChange={handleEmailChange}
                            value={formValues.email}
                            autofocus={true}
                            type={'email'}
                        />
                    )}
                </div>
                <div className={styles['button']}>
                    {validationErrors.length > 0 ? (
                        <ButtonPrimaryDisabled>Continue</ButtonPrimaryDisabled>
                    ) : (
                        <ButtonPrimary onClick={handleContinue}>
                            Continue
                        </ButtonPrimary>
                    )}
                </div>
            </>
        );

        bottomMessageLayout = (
            <div className={styles['bottom_message']}>
                <span className={'text-normal color-gray-700'}>
                    Already have an account?
                </span>
                <a
                    className={'text-normal-bold color-blue-700'}
                    onClick={handleLoginLinkClick}>
                    Login
                </a>
            </div>
        );
    } else if (signUpState === SignUpModalState.registerEmailSuccessful) {
        layout = (
            <>
                <div className={styles['heading']}>
                    <h3 className={'heading4 color-gray-800'}>
                        Create your account
                    </h3>
                </div>
                <div className={styles['text_input']}>
                    <label className={'text-normal color-dark-900'}>
                        Email
                    </label>
                    <TextFieldSecondaryDisabled
                        placeholder={'sample@gmail.com'}
                        value={formValues.email}
                    />
                </div>
                <div
                    className={`${styles['text_input']} ${styles['password_input']}`}>
                    <label className={'text-normal color-dark-900'}>
                        Password
                    </label>
                    {validationErrors.length <= 0 ? (
                        <PasswordFieldSecondary
                            placeholder={'Enter your password'}
                            onChange={handlePasswordChange}
                            value={formValues.password}
                            autofocus={true}
                        />
                    ) : (
                        <PasswordFieldDanger
                            placeholder={'Enter your password'}
                            onChange={handlePasswordChange}
                            value={formValues.password}
                            autofocus={true}
                        />
                    )}
                </div>
                <div className={styles['button']}>
                    {validationErrors.length > 0 ? (
                        <ButtonPrimaryDisabled>
                            Create account
                        </ButtonPrimaryDisabled>
                    ) : (
                        <ButtonPrimary onClick={handleCreateAccount}>
                            Create account
                        </ButtonPrimary>
                    )}
                </div>
                {validationErrors.length > 0 && (
                    <div className={styles['validation_errors']}>
                        <span className={'text-normal color-sinopia-600'}>
                            {validationErrors[0]}
                        </span>
                    </div>
                )}
            </>
        );

        bottomMessageLayout = (
            <div className={styles['bottom_message']}>
                <span className={'text-normal color-gray-700'}>
                    Already have an account?
                </span>
                <a
                    className={'text-normal-bold color-blue-700'}
                    onClick={handleLoginLinkClick}>
                    Login
                </a>
            </div>
        );
    } else if (signUpState === SignUpModalState.login) {
        layout = (
            <>
                <div className={styles['heading']}>
                    <h3 className={'heading4 color-gray-800'}>
                        Login to existing account
                    </h3>
                </div>
                <div className={styles['text_input']}>
                    <label className={'text-normal color-dark-900'}>
                        Email
                    </label>
                    <TextFieldSecondary
                        placeholder={'sample@gmail.com'}
                        onChange={handleEmailChange}
                        value={formValues.email}
                        type={'email'}
                    />
                </div>
                <div
                    className={`${styles['text_input']} ${styles['password_input']}`}>
                    <label className={'text-normal color-dark-900'}>
                        Password
                    </label>
                    <PasswordFieldSecondary
                        placeholder={'Enter your password'}
                        onChange={handlePasswordChange}
                        value={formValues.password}
                    />
                </div>
                <div className={styles['button']}>
                    <ButtonPrimary onClick={handleLoginButtonClick}>
                        Login
                    </ButtonPrimary>
                </div>
                {validationErrors.length > 0 && (
                    <div className={styles['validation_errors']}>
                        <span className={'text-normal color-sinopia-600'}>
                            {validationErrors[0]}
                        </span>
                    </div>
                )}
                <a
                    className={`${styles['forgot_password_link']} text-normal-bold color-gray-600`}
                    onClick={handleForgotPasswordLinkClick}>
                    Forgot password
                </a>
            </>
        );

        bottomMessageLayout = (
            <div className={styles['bottom_message']}>
                <span className={'text-normal color-gray-700'}>
                    Doesn&apos;t have account?
                </span>
                <a
                    className={'text-normal-bold color-blue-700'}
                    onClick={handleSignUpLinkClick}>
                    Sign Up
                </a>
            </div>
        );
    } else if (signUpState === SignUpModalState.restorePassword) {
        layout = (
            <>
                <div className={styles['heading']}>
                    <h3 className={'heading4 color-gray-800'}>
                        Restore your password
                    </h3>
                </div>
                <div className={styles['text_input']}>
                    <label className={'text-normal color-dark-900'}>
                        Email
                    </label>
                    <TextFieldSecondary
                        placeholder={'sample@gmail.com'}
                        onChange={handleEmailChange}
                        value={formValues.email}
                        type={'email'}
                    />
                </div>
                <div className={styles['button']}>
                    {isRestorationMailSent ? (
                        <ButtonPrimaryDisabled>Send</ButtonPrimaryDisabled>
                    ) : (
                        <ButtonPrimary
                            onClick={handleSendRestorationButtonClick}>
                            Send
                        </ButtonPrimary>
                    )}
                </div>
                {validationErrors.length > 0 && (
                    <div className={styles['validation_errors']}>
                        <span className={'text-normal color-sinopia-600'}>
                            {validationErrors[0]}
                        </span>
                    </div>
                )}
            </>
        );

        bottomMessageLayout = (
            <div className={styles['bottom_message']}>
                <span className={'text-normal color-gray-700'}>
                    Doesn&apos;t have account?
                </span>
                <a
                    className={'text-normal-bold color-blue-700'}
                    onClick={handleSignUpLinkClick}>
                    Sign Up
                </a>
            </div>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className={styles['modal_content']}
            disableBodyLock={disableBodyLock}>
            <div className={styles['logo_wrapper']}>
                <LogoSmall className={styles['logo_icon']} />
            </div>
            {layout}
            <div className={styles['line_divider']}>
                <hr />
                <p
                    className={`${styles['text_divider']} text-normal color-gray-700`}>
                    OR
                </p>
            </div>
            <div className={styles['oauth_buttons']}>
                <div
                    className={styles['oauth_button']}
                    onClick={handleGoogleOauthClick}>
                    <img src={GoogleLogo} />
                </div>
                {/*<div*/}
                {/*    className={styles['oauth_button']}*/}
                {/*    onClick={handleFacebookOauthClick}>*/}
                {/*    <img src={FacebookLogo} />*/}
                {/*</div>*/}
            </div>
            {bottomMessageLayout}
        </Modal>
    );
};

export default SignUpModal;
