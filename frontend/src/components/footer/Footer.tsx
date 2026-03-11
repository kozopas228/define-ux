import React from 'react';
import styles from './Footer.module.css';
import { SCREEN_MIN_BOUNDARY_XL } from '../../utils/constants';
import { useScreenSize } from '../../hooks/useScreenSize';

const Footer = () => {
    const screenSize = useScreenSize();

    return (
        <div className={styles['wrapper']}>
            <div className='container'>
                <div className='row'>
                    <div
                        className={
                            screenSize.width >= SCREEN_MIN_BOUNDARY_XL
                                ? 'col-l-12'
                                : 'col-s-4'
                        }>
                        <footer className={styles['footer']}>
                            <p className='text-normal color-gray-700'>
                                © 2024 All rights reserved. Uicons by{' '}
                                <a
                                    href='https://www.flaticon.com/uicons'
                                    target={'_blank'}
                                    rel='noreferrer'>
                                    Flaticon
                                </a>
                                {', '}
                                images by{' '}
                                <a
                                    href='https://www.freepik.com/'
                                    target={'_blank'}
                                    rel='noreferrer'>
                                    Freepik
                                </a>{' '}
                                For any questions{' '}
                                <a href='mailto:support@define-ux.com'>
                                    support@define-ux.com
                                </a>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
