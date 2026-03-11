import React, { useEffect } from 'react';
import styles from './Modal.module.css';

interface IProps {
    isOpen: boolean;
    setIsOpen: any;
    children: React.ReactNode;
    className?: string;
    disableBodyLock?: boolean;
}

const Modal = ({
    isOpen,
    setIsOpen,
    children,
    className,
    disableBodyLock,
}: IProps) => {
    if (isOpen && !disableBodyLock) {
        document.body.classList.add('_lock');
    }

    function handleWrapperMouseDown(e: React.MouseEvent) {
        setIsOpen(false);
        if (!disableBodyLock) {
            document.body.classList.remove('_lock');
        }
    }

    function handleContentMouseDown(e: React.MouseEvent) {
        e.stopPropagation();
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code == 'Escape') {
                setIsOpen(false);
                document.body.classList.remove('_lock');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, setIsOpen]);

    return (
        <div
            className={`${styles['modal_wrapper']} ${
                isOpen ? styles['open'] : ''
            }`}
            onMouseDown={handleWrapperMouseDown}>
            <div
                className={`${styles['modal_content']} ${className}`}
                onMouseDown={handleContentMouseDown}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
