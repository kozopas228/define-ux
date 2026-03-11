import React, { useState } from 'react';
import styles from './Dropdown.module.css';
import TickDown from '../../../assets/icons/tick-down.svg';
import Globe from '../../../assets/icons/globe.svg';
import UKFlag from '../../../assets/images/uk-flag.png';
import UAFlag from '../../../assets/images/ua-flag.png';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    AppLanguages,
    setAppLanguage,
} from '../../../store/features/language/languageSlice';

const ChangeLanguage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = useAppSelector(
        (state) => state.languageReducer.language
    );
    const dispatch = useAppDispatch();

    function handleChangeLanguage(language: AppLanguages) {
        dispatch(setAppLanguage(language));
        setIsOpen(false);
    }

    return (
        <div className={styles['hamburger_dropdown']}>
            <div
                className={styles['header']}
                onClick={() => setIsOpen((prev) => !prev)}>
                <div className={styles['heading']}>
                    <Globe className={styles['globe_icon']} />
                    <p className={'color-white text-normal'}>
                        {currentLanguage.fullName}
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
                <div
                    className={styles['body_item']}
                    onClick={() => handleChangeLanguage(AppLanguages.English)}>
                    <img src={UKFlag} />
                    <p className={'text-normal color-white'}>English</p>
                </div>
                {/*<div*/}
                {/*    className={styles['body_item']}*/}
                {/*    onClick={() =>*/}
                {/*        handleChangeLanguage(AppLanguages.Ukrainian)*/}
                {/*    }>*/}
                {/*    <img src={UAFlag} />*/}
                {/*    <p className={'text-normal color-white'}>Ukrainian</p>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default ChangeLanguage;
