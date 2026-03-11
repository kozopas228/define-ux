import React from 'react';
import styles from './CanvasStateDebugInfo.module.css';

interface IProps {
    scale: number;
    isSelecting: boolean;
    isMoving: boolean;
    isDragging: boolean;
}

const CanvasStateDebugInfo = ({
    scale,
    isSelecting,
    isMoving,
    isDragging,
}: IProps) => {
    return (
        <div
            className={styles['zoom-container']}
            style={{
                bottom: 0,
                right: 0,
            }}>
            <code className={styles['zoom-data']}>scale: {`{ ${scale} }`}</code>
            <code className={styles['zoom-data']}>
                selecting: {`{ ${isSelecting} }`}
            </code>
            <code className={styles['zoom-data']}>
                moving: {`{ ${isMoving} }`}
            </code>
            <code className={styles['zoom-data']}>
                dragging: {`{ ${isDragging} }`}
            </code>
        </div>
    );
};

export default CanvasStateDebugInfo;
