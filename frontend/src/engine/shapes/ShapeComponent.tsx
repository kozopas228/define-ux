import React, {
    memo,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Point } from '../types/Point';
import { Shape } from '../types/Shape';
import ShapeArrowPoint from './ShapeArrowPoint';
import { ShapesContext } from '../context/shapes.context';
import { ArrowsContext } from '../context/arrows.context';
import { DraggingContext } from '../context/dragging.context';
import { cloneShapes, generateUUID, toVirtualX, toVirtualY } from '../util';
import ShapeText from './ShapeText';
import ShapeBorder from './ShapeBorder';
import ShapeSizePoints from './ShapeSizePoints';
import { ResizingContext } from '../context/resizing.context';
import { ResizingDirection } from '../types/ResizingDirection';
import { UUID } from '../types/Uuid';

interface IProps {
    id: UUID;
    coords: Point;
    width: number;
    height: number;
    text?: string;
    children: React.ReactNode;
}

const ShapeComponent = ({
    id,
    coords,
    height,
    width,
    text,
    children,
}: IProps) => {
    const { shapes, setShapes } = useContext(ShapesContext)!;
    const { setArrows, isArrowing, arrowType, setArrowingFinishShapeId } =
        useContext(ArrowsContext)!;
    const { setIsDragging, setDraggingPoint } = useContext(DraggingContext)!;
    const {
        setIsResizing,
        setResizingDirection,
        setResizingShapeId,
        setResizingPoint,
    } = useContext(ResizingContext)!;

    const [internalComponentWidth, setInternalComponentWidth] =
        useState<number>(width);
    const [internalComponentHeight, setInternalComponentHeight] =
        useState<number>(height);

    const [isActive, setIsActive] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // On component load, set whether it's active (i.e., this is not passed in props)
    // The same applies to dimensions - the component doesn't set them itself, but receives them from the parent
    useEffect(() => {
        const currentShapeObject = shapes.find((item) => item.id === id);
        if (currentShapeObject) {
            setIsActive(currentShapeObject.isSelected);
            setIsEditing(currentShapeObject.isEditing);
            setInternalComponentWidth(currentShapeObject.width!);
            setInternalComponentHeight(currentShapeObject.height!);
        }
    }, [id, shapes]);

    function handleMouseDown(e: React.MouseEvent) {
        // don't prevent if wheel click
        if (e.button === 1) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Copy elements when alt/option is pressed
        if (e.altKey && isActive) {
            setShapes((prev: Shape[]) => {
                const currentShape = prev.find((shape) => shape.id === id)!;
                currentShape.isSelected = true;

                const selectedShapes = prev.filter((shape) => shape.isSelected);

                selectedShapes.forEach((sh) => {
                    sh.isSelected = false;
                    sh.isEditing = false;
                });

                const clonedSelectedShapes = cloneShapes(...selectedShapes);

                clonedSelectedShapes.forEach((sh) => (sh.isSelected = true));

                return [...prev, ...clonedSelectedShapes];
            });

            // Select objects by mouse click
        } else {
            setShapes((prev: Shape[]) => {
                const currenShapeObject = prev.find(
                    (shapeObject) => shapeObject.id === id
                )!;

                // this is to be able to select multiple objects
                if (!e.shiftKey && !currenShapeObject.isSelected) {
                    prev.forEach((shapeObject) => {
                        shapeObject.isSelected = false;
                        shapeObject.isEditing = false;
                    });
                }

                currenShapeObject.isSelected = true;

                return [...prev];
            });
        }

        setArrows((prev) => {
            prev.forEach((arrow) => (arrow.isSelected = false));

            return [...prev];
        });

        setIsDragging(true);
        setDraggingPoint({ x: e.clientX, y: e.clientY });
    }

    function handleMouseEnter(e: React.MouseEvent) {
        if (!e.altKey && !e.shiftKey) {
            setIsHover(true);
        }

        if (isArrowing) {
            setArrowingFinishShapeId(id);
        }
    }

    function handleMouseMove(e: React.MouseEvent) {
        if ((e.altKey || e.shiftKey) && isHover) {
            setIsHover(false);
        }
    }

    function handleMoseLeave() {
        setIsHover(false);

        if (isArrowing) {
            setArrowingFinishShapeId(null);
        }
    }

    function handleDoubleClick() {
        if (isActive) {
            setShapes((prev) => {
                const currenShapeObject = prev.find(
                    (shapeObject) => shapeObject.id === id
                )!;

                currenShapeObject.isEditing = true;

                return [...prev];
            });
        }
    }

    const saveText = useCallback(
        (newText: string) => {
            setShapes((prev) => {
                const currenShapeObject = prev.find(
                    (shapeObject) => shapeObject.id === id
                )!;

                currenShapeObject.text = newText;
                currenShapeObject.isEditing = false;

                return [...prev];
            });
        },
        [id, setShapes]
    );

    function setResizing(type: ResizingDirection, startingCoords: Point) {
        setIsResizing(true);
        setResizingDirection(type);
        setResizingShapeId(id);
        setResizingPoint(startingCoords);
    }

    return (
        <div
            style={{
                position: 'absolute',
                left: toVirtualX(coords.x),
                top: toVirtualY(coords.y),
                outline: isHover ? '3px solid green' : undefined,
                zIndex: 99,
                // backgroundColor: 'rgb(255,123,207)',
                width: internalComponentWidth,
                height: internalComponentHeight,
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMoseLeave}
            onDoubleClick={handleDoubleClick}
            onMouseMove={handleMouseMove}>
            {isHover && isActive && !isEditing && (
                <>
                    <ShapeArrowPoint
                        width={internalComponentWidth}
                        height={internalComponentHeight}
                        shapeId={id}
                    />
                    <ShapeSizePoints
                        width={internalComponentWidth}
                        height={internalComponentHeight}
                        setResizing={setResizing}
                    />
                </>
            )}
            {isActive && !isEditing && (
                <ShapeBorder
                    width={internalComponentWidth}
                    height={internalComponentHeight}
                    setResizing={setResizing}
                />
            )}
            {children}
            <ShapeText
                text={text}
                isEditing={isEditing}
                saveText={saveText}
            />
        </div>
    );
};

export default memo(ShapeComponent);
