import React, { useEffect, useRef, useState } from 'react';
import styles from './Username.module.css';
import TickDown from '../../../assets/icons/tick-down.svg';
import UserIcon from '../../../assets/icons/user.svg';
import ExitIcon from '../../../assets/icons/exit.svg';
import { NavLink } from 'react-router-dom';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { useAppSelector } from '../../../store/hooks';
import { removeAccessToken, revokeRefreshToken } from '../../../services/auth';

const Username = () => {
    const currentUser = useAppSelector((state) => state.userReducer.user)!;

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    async function handleExit() {
        await revokeRefreshToken();
        removeAccessToken();
    }

    useOutsideClick({
        ref: dropdownRef,
        handler: () => setIsOpen(false),
    });

    return (
        <div
            className={styles['username']}
            onClick={handleClick}
            ref={dropdownRef}>
            <span className={'text-big-bold color-dark-900'}>
                {currentUser.username}
            </span>
            <TickDown
                className={`${styles['tick_down_icon']} ${
                    isOpen ? styles['active'] : ''
                }`}
            />
            <div
                className={`${styles['content']} shadow1 ${
                    isOpen ? styles['active'] : ''
                }`}>
                <NavLink
                    className={styles['menu_item']}
                    to={'/profile'}>
                    <UserIcon className={styles['menu_icon']} />
                    <p className={'text-normal color-dark-900'}>My profile</p>
                </NavLink>
                <div
                    className={styles['menu_item']}
                    onClick={handleExit}>
                    <ExitIcon className={styles['menu_icon']} />
                    <p className={'text-normal color-dark-900'}>Exit</p>
                </div>
            </div>
        </div>
    );
};

export default Username;
