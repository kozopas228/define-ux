import React, { useContext, useMemo } from 'react';
import { ScaleContext } from '../context/scale.context';
import { ResizingDirection } from '../types/ResizingDirection';
import { Point } from '../types/Point';

interface IProps {
    width: number;
    height: number;
    setResizing: (type: ResizingDirection, startingCoords: Point) => void;
}

const zIndex = 999;

// Border that also handles resizing
const ShapeBorder = ({ width, height, setResizing }: IProps) => {
    const stylesWrapper: React.CSSProperties = {
        position: 'absolute',
        zIndex: zIndex,
    };

    const stylesLine: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: 'violet',
        zIndex: zIndex,
    };

    const { scale } = useContext(ScaleContext)!;

    const sizeWrapper = useMemo(() => {
        return 15 / scale;
    }, [scale]);

    const size = useMemo(() => {
        return 5 / scale;
    }, [scale]);

    const increase = useMemo(() => {
        return 20 / scale;
    }, [scale]);

    const lineIncrease = useMemo(() => {
        return 16 / scale;
    }, [scale]);

    const offset = useMemo(() => {
        return 10 / scale;
    }, [scale]);

    const lineOffset = useMemo(() => {
        return 2 / scale;
    }, [scale]);

    function handleUpResize(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.up, { x: e.clientX, y: e.clientY });
    }

    function handleDownResize(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.down, { x: e.clientX, y: e.clientY });
    }

    function handleLeftResize(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.left, { x: e.clientX, y: e.clientY });
    }

    function handleRightResize(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.right, { x: e.clientX, y: e.clientY });
    }

    return (
        <>
            <div
                style={{
                    ...stylesWrapper,
                    width: width + increase,
                    height: sizeWrapper,
                    top: -offset,
                    left: -offset,
                    cursor: 'ns-resize',
                }}
                onMouseDown={handleUpResize}>
                <div
                    style={{
                        ...stylesLine,
                        width: width + lineIncrease,
                        height: size,
                        top: lineOffset,
                        left: lineOffset,
                    }}></div>
            </div>
            <div
                style={{
                    ...stylesWrapper,
                    width: width + increase,
                    height: sizeWrapper,
                    bottom: -offset,
                    left: -offset,
                    cursor: 'ns-resize',
                }}
                onMouseDown={handleDownResize}>
                <div
                    style={{
                        ...stylesLine,
                        width: width + lineIncrease,
                        height: size,
                        bottom: lineOffset,
                        left: lineOffset,
                    }}></div>
            </div>
            <div
                style={{
                    ...stylesWrapper,
                    height: height + increase,
                    width: sizeWrapper,
                    top: -offset,
                    left: -offset,
                    cursor: 'ew-resize',
                }}
                onMouseDown={handleLeftResize}>
                <div
                    style={{
                        ...stylesLine,
                        height: height + lineIncrease,
                        width: size,
                        top: lineOffset,
                        left: lineOffset,
                    }}></div>
            </div>
            <div
                style={{
                    ...stylesWrapper,
                    height: height + increase,
                    width: sizeWrapper,
                    top: -offset,
                    right: -offset,
                    cursor: 'ew-resize',
                }}
                onMouseDown={handleRightResize}>
                <div
                    style={{
                        ...stylesLine,
                        height: height + lineIncrease,
                        width: size,
                        top: lineOffset,
                        right: lineOffset,
                    }}></div>
            </div>
        </>
    );
};

export default ShapeBorder;
