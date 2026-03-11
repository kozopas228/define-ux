import React, { useContext } from 'react';
import { Point } from '../../types/Point';
import { ARROW_Z_INDEX } from '../../constants';
import { ArrowsContext } from '../../context/arrows.context';
import { toVirtualX, toVirtualY } from '../../util';

interface IProps {
    isActive: boolean;
    coords: Point;
    width: number;
    angle: number;
    handleMouseDown: (e: React.MouseEvent) => any;
    hasFinishShape: boolean;
}

const BrokenPart = ({
    isActive,
    coords,
    width,
    angle,
    handleMouseDown,
    hasFinishShape,
}: IProps) => {
    const { isArrowing } = useContext(ArrowsContext)!;

    return (
        <div
            style={{
                zIndex: ARROW_Z_INDEX,
                backgroundColor: isActive ? 'cyan' : undefined,
                pointerEvents: isArrowing ? 'none' : 'auto',
                position: 'absolute',
                left: toVirtualX(coords.x),
                top: toVirtualY(coords.y) - 20,
                width: width,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'left', // So that rotate works relative to the left edge
                opacity: hasFinishShape ? 1 : 0.3,
            }}
            onMouseDown={handleMouseDown}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <div
                    style={{
                        width: '100%',
                        backgroundColor: 'green',
                        height: 10,
                    }}></div>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderTop: '20px solid transparent',
                        borderBottom: '20px solid transparent',
                        borderLeft: '30px solid green',
                    }}></div>
            </div>
        </div>
    );
};

export default BrokenPart;
