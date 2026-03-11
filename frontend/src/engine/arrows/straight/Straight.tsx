import React, { useContext } from 'react';
import { Point } from '../../types/Point';
import { ARROW_Z_INDEX } from '../../constants';
import { toVirtualX, toVirtualY } from '../../util';
import { ArrowsContext } from '../../context/arrows.context';

interface IProps {
    isActive: boolean;
    coordsStart: Point;
    distance: number;
    angle: number;
    handleMouseDown: (e: React.MouseEvent) => any;
    hasFinishShape: boolean;
}

const Straight = ({
    isActive,
    coordsStart,
    distance,
    angle,
    handleMouseDown,
    hasFinishShape,
}: IProps) => {
    const { isArrowing } = useContext(ArrowsContext)!;

    return (
        <div
            style={{
                position: 'absolute',
                left: toVirtualX(coordsStart.x),
                top: toVirtualY(coordsStart.y) - 20,
                width: distance,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'left', // So that rotate works relative to the left edge, not center as default
                backgroundColor: isActive ? 'cyan' : undefined,
                zIndex: hasFinishShape ? 1 : ARROW_Z_INDEX,
                pointerEvents: isArrowing ? 'none' : 'auto',
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
                        backgroundColor: 'blue',
                        height: 10,
                    }}></div>
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderTop: '20px solid transparent',
                        borderBottom: '20px solid transparent',
                        borderLeft: '30px solid blue',
                    }}></div>
            </div>
        </div>
    );
};

export default Straight;
