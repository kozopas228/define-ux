import React, { useState } from 'react';
import styles from './Header.module.css';
import LogoBig from '../../assets/icons/logo-big.svg';
import LogoSmall from '../../assets/icons/logo-small.svg';
import ChangeLanguage from './change-language/ChangeLanguage';
import Username from './username/Username';
import ButtonSecondary from '../buttons/ButtonSecondary';
import { NavLink } from 'react-router-dom';
import { useScreenSize } from '../../hooks/useScreenSize';
import { SCREEN_MIN_BOUNDARY_L } from '../../utils/constants';
import Hamburger from './hamburger/Hamburger';
import SignUpModal from './sign-up-modal/SignUpModal';
import { useAppSelector } from '../../store/hooks';

const Header = () => {
    const currentUser = useAppSelector((state) => state.userReducer.user);
    const isSignedIn = currentUser !== null;

    const screenSize = useScreenSize();

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    function handleSignUp() {
        setIsSignUpModalOpen(true);
    }

    let layout: React.JSX.Element;

    if (screenSize.width >= SCREEN_MIN_BOUNDARY_L) {
        layout = (
            <>
                <div className='col-l-12'>
                    <header className={`${styles.header}`}>
                        <nav className={styles['logo_and_projects']}>
                            <NavLink
                                to={'/'}
                                aria-label={'/'}>
                                <LogoBig className={styles['logo_big']} />
                            </NavLink>
                            {isSignedIn ? (
                                <NavLink
                                    className={`${styles['nav_link']} text-big-bold color-gray-700`}
                                    to={'/projects'}>
                                    Projects
                                </NavLink>
                            ) : (
                                <></>
                            )}
                        </nav>
                        <div className={styles['language_and_user']}>
                            <ChangeLanguage />
                            {isSignedIn ? (
                                <Username />
                            ) : (
                                <div className={styles['sign_in']}>
                                    <ButtonSecondary onClick={handleSignUp}>
                                        Sign Up
                                    </ButtonSecondary>
                                </div>
                            )}
                        </div>
                    </header>
                </div>
            </>
        );
    } else {
        layout = (
            <>
                <div className='col-s-4'>
                    <header className={`${styles.header}`}>
                        <nav className={styles['logo_and_projects']}>
                            <NavLink
                                to={'/'}
                                aria-label={'/'}
                                className={styles['logo_small_nav_link']}>
                                <LogoSmall className={styles['logo_small']} />
                            </NavLink>
                        </nav>
                        <Hamburger
                            openSignUpModal={() => setIsSignUpModalOpen(true)}
                        />
                    </header>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={styles['wrapper']}>
                <div className='container'>
                    <div className='row'>{layout}</div>
                </div>
            </div>
            <SignUpModal
                isOpen={isSignUpModalOpen}
                setIsOpen={setIsSignUpModalOpen}
                disableBodyLock={true}
            />
        </>
    );
};

export default Header;
