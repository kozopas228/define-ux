import React, { useContext, useMemo } from 'react';
import { ScaleContext } from '../context/scale.context';
import { ResizingDirection } from '../types/ResizingDirection';
import { Point } from '../types/Point';

interface IProps {
    width: number;
    height: number;
    setResizing: (type: ResizingDirection, startingCoords: Point) => void;
}

const zIndex = 9999;

// These are the 4 squares at the corners of the shape to resize it
const ShapeSizePoints = ({ width, height, setResizing }: IProps) => {
    const { scale } = useContext(ScaleContext)!;

    const pointSize = useMemo(() => {
        return 15 / scale;
    }, [scale]);

    const offset = useMemo(() => {
        return 15 / scale;
    }, [scale]);

    const styleObject: React.CSSProperties = {
        position: 'absolute',
        border: '3px solid violet',
        backgroundColor: 'violet',
        borderRadius: 3,
        width: pointSize,
        height: pointSize,
        zIndex,
    };

    function handleTopLeftMouseDown(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.leftUp, { x: e.clientX, y: e.clientY });
    }

    function handleTopRightMouseDown(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.rightUp, { x: e.clientX, y: e.clientY });
    }

    function handleBottomLeftMouseDown(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.leftDown, { x: e.clientX, y: e.clientY });
    }

    function handleBottomRightMouseDown(e: React.MouseEvent) {
        e.stopPropagation();
        setResizing(ResizingDirection.rightDown, {
            x: e.clientX,
            y: e.clientY,
        });
    }

    return (
        <>
            <div
                style={{
                    ...styleObject,
                    top: -offset,
                    left: -offset,
                    cursor: 'nwse-resize',
                }}
                onMouseDown={handleTopLeftMouseDown}></div>
            <div
                style={{
                    ...styleObject,
                    top: -offset,
                    right: -offset,
                    cursor: 'nesw-resize',
                }}
                onMouseDown={handleTopRightMouseDown}></div>
            <div
                style={{
                    ...styleObject,
                    bottom: -offset,
                    left: -offset,
                    cursor: 'nesw-resize',
                }}
                onMouseDown={handleBottomLeftMouseDown}></div>
            <div
                style={{
                    ...styleObject,
                    bottom: -offset,
                    right: -offset,
                    cursor: 'nwse-resize',
                }}
                onMouseDown={handleBottomRightMouseDown}></div>
        </>
    );
};

export default ShapeSizePoints;
