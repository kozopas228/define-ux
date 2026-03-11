import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './Dropdown.module.css';
import TickDown from '../../../assets/icons/tick-down.svg';
import UserIcon from '../../../assets/icons/user.svg';
import ExitIcon from '../../../assets/icons/exit.svg';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { removeAccessToken, revokeRefreshToken } from "../../../services/auth";

interface IProps {
    setIsHamburgerOpen: Dispatch<SetStateAction<boolean>>;
}

const Username = ({ setIsHamburgerOpen }: IProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const currentUser = useAppSelector((state) => state.userReducer.user);

    async function handleExit() {
        await revokeRefreshToken();
        removeAccessToken();
    }

    return (
        <div className={styles['hamburger_dropdown']}>
            <div
                className={styles['header']}
                onClick={() => setIsOpen((prev) => !prev)}>
                <div className={styles['heading']}>
                    <p className={'color-white text-normal'}>
                        {currentUser?.username}
                    </p>
                </div>
                <TickDown
                    className={`${styles['tick_down_icon']} ${
                        isOpen ? styles['active'] : ''
                    }`}
                />
            </div>
            <div
                className={`${styles['body']} ${
                    isOpen ? styles['active'] : ''
                }`}>
                <NavLink
                    className={`${styles['body_item']} ${styles['nav_link']}`}
                    to={'/profile'}
                    onClick={() => {
                        setIsOpen(false);
                        setIsHamburgerOpen(false);
                    }}>
                    <UserIcon />
                    <p className={'text-normal color-white'}>My Profile</p>
                </NavLink>
                <div
                    className={styles['body_item']}
                    onClick={handleExit}>
                    <ExitIcon />
                    <p className={'text-normal color-white'}>Exit</p>
                </div>
            </div>
        </div>
    );
};

export default Username;
