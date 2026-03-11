import React from 'react';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    return (
        <>
            <h3 className={styles.notFoundErrorPageHeading}>
                <code>Not Found</code>
            </h3>
        </>
    );
};

export default NotFoundPage;
