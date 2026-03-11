import React, { useContext, useEffect, useState } from 'react';
import styles from './CoordsDebugInfo.module.css';
import { RefsContext } from '../context/refs.context';
import { toRealX, toRealY } from '../util';

interface IProps {
    scale: number;
    offsetX: number;
    offsetY: number;
}

const CoordsDebugInfo = ({ scale, offsetX, offsetY }: IProps) => {
    const [clientX, setClientX] = useState(0);
    const [clientY, setClientY] = useState(0);
    const [relWrapperX, setRelWrapperX] = useState(0);
    const [relWrapperY, setRelWrapperY] = useState(0);
    const [realX, setRealX] = useState(0);
    const [realY, setRealY] = useState(0);
    const [virtualX, setVirtualX] = useState(0);
    const [virtualY, setVirtualY] = useState(0);

    const { wrapperRef, divRef } = useContext(RefsContext)!;

    useEffect(() => {
        const wrapperElement = wrapperRef.current!;
        const infiniteDivElement = divRef.current!;

        const wrapperBoundingClientRect =
            wrapperElement.getBoundingClientRect();

        function mouseMoveHandler(e: MouseEvent) {
            // coordinates relative to browser window, literally: "where is the cursor at this moment"
            setClientX(e.clientX);
            setClientY(e.clientY);

            // coordinates relative to wrapper
            const relWrapperX = e.clientX - wrapperBoundingClientRect.left;
            const relWrapperY = e.clientY - wrapperBoundingClientRect.top;
            setRelWrapperX(relWrapperX);
            setRelWrapperY(relWrapperY);

            const infiniteDivBoundingClientRect =
                infiniteDivElement.getBoundingClientRect();

            // coordinates relative to top-left corner (virtual coordinates)
            const virtualX = Math.round(
                (e.clientX - infiniteDivBoundingClientRect.left) / scale
            );

            const virtualY = Math.round(
                (e.clientY - infiniteDivBoundingClientRect.top) / scale
            );
            setVirtualX(virtualX);
            setVirtualY(virtualY);

            const realX = toRealX(virtualX);
            const realY = toRealY(virtualY);
            setRealX(realX);
            setRealY(realY);
        }

        wrapperElement.addEventListener('mousemove', mouseMoveHandler);

        return () => {
            wrapperElement.removeEventListener('mouseMove', mouseMoveHandler);
        };
    }, [wrapperRef, divRef, scale]);

    return (
        <div
            className={styles['debug-info-container']}
            style={{
                bottom: 0,
                left: 0,
            }}>
            <code className={styles['debug-data']}>
                client: {`{ x: ${clientX}, y: ${clientY} } `}
            </code>
            <code className={styles['debug-data']}>
                relatively to wrapper:{' '}
                {`{ x: ${relWrapperX}, y: ${relWrapperY} } `}
            </code>
            <code className={styles['debug-data']}>
                real: {`{ x: ${realX}, y: ${realY} } `}
            </code>
            <code className={styles['debug-data']}>
                virtual: {`{ x: ${virtualX}, y: ${virtualY} } `}
            </code>
            <code className={styles['debug-data']}>
                offset: {`{ x: ${offsetX}, y: ${offsetY} } `}
            </code>
        </div>
    );
};

export default CoordsDebugInfo;
