import React, { useState } from 'react';
import styles from './Hamburger.module.css';
import ChangeLanguage from './ChangeLanguage';
import ButtonSecondary from '../../buttons/ButtonSecondary';
import { NavLink } from 'react-router-dom';
import Username from './Username';
import { useAppSelector } from '../../../store/hooks';

interface IProps {
    openSignUpModal?: any;
}

const Hamburger = ({ openSignUpModal }: IProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const currentUser = useAppSelector((state) => state.userReducer.user);
    const isSignedIn = currentUser !== null;

    function handleClick() {
        if (isOpen) {
            document.body.classList.remove('_lock');
        } else {
            document.body.classList.add('_lock');
        }

        setIsOpen((prev) => !prev);
    }

    function handleSignUp() {
        openSignUpModal();
    }

    return (
        <div>
            <div
                className={`${styles['burger_icon']} ${
                    isOpen ? styles['active'] : ''
                }`}
                onClick={handleClick}>
                <span></span>
            </div>

            <div
                className={`${styles['wrapper']} ${
                    isOpen ? styles['active'] : ''
                }`}>
                <div className='container'>
                    <div className={`row ${styles['change_language']}`}>
                        <div className={`col-m-6`}>
                            <ChangeLanguage />
                        </div>
                    </div>
                    {isSignedIn ? (
                        <>
                            <div className={`row ${styles['projects']}`}>
                                <div className={`col-m-6`}>
                                    <NavLink
                                        to={'/projects'}
                                        onClick={() => {
                                            setIsOpen(false);
                                            document.body.classList.remove(
                                                '_lock'
                                            );
                                        }}>
                                        <ButtonSecondary>
                                            Projects
                                        </ButtonSecondary>
                                    </NavLink>
                                </div>
                            </div>
                            <div className={`row ${styles['username']}`}>
                                <div className={`col-m-6`}>
                                    <Username setIsHamburgerOpen={setIsOpen} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={`row ${styles['sign_up']}`}>
                            <div className={`col-m-6`}>
                                <ButtonSecondary onClick={handleSignUp}>
                                    Sign Up
                                </ButtonSecondary>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hamburger;
