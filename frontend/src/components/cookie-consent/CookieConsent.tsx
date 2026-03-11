import React, { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';
import ButtonPrimary from "../buttons/ButtonPrimary";

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true); // Show consent if no prior response
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false); // Hide the banner
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles['container']}`}>
            <p className={`text-big color-white`}>
                We use cookies to ensure you get the best experience on our
                website.
            </p>
            <div className={styles['buttons']}>
                <ButtonPrimary
                    onClick={handleAccept}
                    className={`${styles['button']} text-normal color-white`}>
                    Accept
                </ButtonPrimary>
            </div>
        </div>
    );
};

export default CookieConsent;
