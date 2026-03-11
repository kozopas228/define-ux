import React, { useEffect, useRef, useState } from 'react';
import styles from './ChangeLanguage.module.css';
import Globe from '../../../assets/icons/globe.svg';
import TickDown from '../../../assets/icons/tick-down.svg';
import UKFlag from '../../../assets/images/uk-flag.png';
import UAFlag from '../../../assets/images/ua-flag.png';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    AppLanguages,
    setAppLanguage,
} from '../../../store/features/language/languageSlice';
import useOutsideClick from '../../../hooks/useOutsideClick';

const ChangeLanguage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = useAppSelector(
        (state) => state.languageReducer.language
    );
    const dispatch = useAppDispatch();

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    function handleChangeLanguage(language: AppLanguages) {
        dispatch(setAppLanguage(language));
    }

    useOutsideClick({
        ref: dropdownRef,
        handler: () => setIsOpen(false),
    });

    return (
        <div
            className={`${styles['change_language']}`}
            onClick={handleClick}
            ref={dropdownRef}>
            <Globe className={styles['globe_icon']} />
            <div className={styles['language_tick']}>
                <span className={`text-normal color-dark-900`}>
                    {currentLanguage.shortName}
                </span>
                <TickDown
                    className={`${styles['tick_down_icon']} ${
                        isOpen ? styles['active'] : ''
                    }`}
                />
            </div>
            <div
                className={`${styles['content']} shadow1 ${
                    isOpen ? styles['active'] : ''
                }`}>
                <div
                    className={styles['language_item']}
                    onClick={() => handleChangeLanguage(AppLanguages.English)}>
                    <img
                        src={UKFlag}
                        className={styles['flag']}
                    />
                    <p className={'text-normal color-dark-900'}>English</p>
                </div>
                {/*<div*/}
                {/*    className={styles['language_item']}*/}
                {/*    onClick={() =>*/}
                {/*        handleChangeLanguage(AppLanguages.Ukrainian)*/}
                {/*    }>*/}
                {/*    <img*/}
                {/*        src={UAFlag}*/}
                {/*        className={styles['flag']}*/}
                {/*    />*/}
                {/*    <p className={'text-normal color-dark-900'}>Ukrainian</p>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default ChangeLanguage;
