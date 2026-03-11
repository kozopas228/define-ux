import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react';
import styles from './UXCanvas.module.css';
import GriddedCoordsSystem from './debug-components/GriddedCoordsSystem';
import CoordsDebugInfo from './debug-components/CoordsDebugInfo';
import FunctionSamples from './debug-components/MathFunctionSamples';
import SelectArea from './SelectArea';
import { UxEditor } from './ux-editor';
import { Shape } from './types/Shape';
import { Arrow } from './types/Arrow';
import { ArbitraryObject } from './types/ArbitraryObject';
import { toRealX, toRealY, toVirtualX, toVirtualY } from './util';
import {
    LEFT_MOUSE_BUTTON,
    MAX_SCALE,
    MIDDLE_MOUSE_BUTTON,
    MIN_SCALE,
    RIGHT_MOUSE_BUTTON,
    UX_CANVAS_DIV_DEFAULT_HEIGHT,
    UX_CANVAS_DIV_DEFAULT_OFFSET_X,
    UX_CANVAS_DIV_DEFAULT_OFFSET_Y,
    UX_CANVAS_DIV_DEFAULT_WIDTH,
    UX_CANVAS_WRAPPER_HEIGHT,
    UX_CANVAS_WRAPPER_WIDTH,
} from './constants';
import { Point } from './types/Point';
import UxCanvasProvider from './context/ux-canvas.provider';
import {
    divOffsetReducer,
    DivOffsetReducerType,
} from './reducers/div-offset.reducer';
import CanvasStateDebugInfo from './debug-components/CanvasStateDebugInfo';
import { ResizingDirection } from './types/ResizingDirection';
import { ArrowType } from './types/ArrowType';
import { resizeShape } from './tools/resize.tool';
import { makeArrow } from './tools/arrow.tool';
import { moveCanvas } from './tools/move.tools';
import { dragShape } from './tools/drag.tool';
import { scaleScroll } from './tools/scroll.tool';
import { KeyboardScaleType } from './types/KeyboardScaleType';
import { UUID } from './types/Uuid';

const editor = new UxEditor();

interface IProps {
    handleMount: (editor: UxEditor) => void;
}

const UXCanvas = ({ handleMount }: IProps) => {
    // region refs
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);

    // endregion

    // region reducers

    // initialize infiniteDiv in the center of its parent (wrapper)
    // offset is calculated in virtual coordinates
    const [divOffset, dispatchDivOffset] = useReducer(divOffsetReducer, {
        x: UX_CANVAS_WRAPPER_WIDTH / 2 - UX_CANVAS_DIV_DEFAULT_OFFSET_X,
        y: UX_CANVAS_WRAPPER_HEIGHT / 2 - UX_CANVAS_DIV_DEFAULT_OFFSET_Y,
    });

    // endregion

    //region state
    const [count, setCount] = useState(0);

    // moving the div itself (e.g., when the middle mouse button is pressed)
    const [isMoving, setIsMoving] = useState(false);
    const [movingPoint, setMovingPoint] = useState<Point>({ x: 0, y: 0 });

    const [scale, setScale] = useState(1);

    // select
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectingPoint, setSelectingPoint] = useState<Point | null>(null);
    const [selectingEndingPoint, setSelectingEndingPoint] =
        useState<Point | null>(null);

    // objects
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const [arbitraries, setArbitraries] = useState<ArbitraryObject[]>([]);

    // drag 'n drop of shapes (figures)
    const [isDragging, setIsDragging] = useState(false);
    const [draggingPoint, setDraggingPoint] = useState<Point | null>(null);

    // arrows
    const [isArrowing, setIsArrowing] = useState(false); //is arrow creating at all
    const [arrowType, setArrowType] = useState<ArrowType | null>(null);
    const [arrowingStartPoint, setArrowingStartPoint] = useState<Point | null>(
        null
    );
    const [arrowingFinishPoint, setArrowingFinishPoint] =
        useState<Point | null>(null);
    const [arrowingStartShapeId, setArrowingStartShapeId] =
        useState<UUID | null>(null);
    const [arrowingFinishShapeId, setArrowingFinishShapeId] =
        useState<UUID | null>(null);
    const [currentArrow, setCurrentArrow] = useState<Arrow | null>(null);

    // resizing the shape
    const [isResizing, setIsResizing] = useState(false);
    const [resizingDirection, setResizingDirection] =
        useState<ResizingDirection | null>(null);
    const [resizingShapeId, setResizingShapeId] = useState<UUID | null>(null);
    const [resizingPoint, setResizingPoint] = useState<Point | null>(null);
    // endregion

    // region event handlers
    function wrapperDivMouseDownHandler(e: React.MouseEvent) {
        // left mouse button === selecting
        if (e.button === LEFT_MOUSE_BUTTON) {
            setIsSelecting(true);

            // save the initial point for further difference calculation
            setSelectingPoint({ x: e.clientX, y: e.clientY });

            // remove all previously selected shapes
            deselectAllShapes();

            // remove all previously selected arrows
            deselectAllArrows();
        }
        // wheel click
        if (e.button === MIDDLE_MOUSE_BUTTON) {
            setIsMoving(true);

            // save the initial point for further difference calculation
            setMovingPoint({ x: e.clientX, y: e.clientY });
        }
    }

    function wrapperDivMouseUpHandler(e: React.MouseEvent) {
        // left mouse up
        if (e.button === LEFT_MOUSE_BUTTON) {
            setIsSelecting(false);
            setSelectingPoint(null);
            setSelectingEndingPoint(null);
            setIsDragging(false);
            setDraggingPoint(null);
            setIsArrowing(false);
            setArrowingStartPoint(null);
            setArrowingFinishPoint(null);
            setArrowingStartShapeId(null);
            setArrowingFinishShapeId(null);
            setCurrentArrow(null);
            setArrowType(null);
            setIsResizing(false);
            setResizingDirection(null);
            setResizingShapeId(null);
            setResizingPoint(null);
        }

        // wheel mouse up
        if (e.button === MIDDLE_MOUSE_BUTTON) {
            setIsMoving(false);
        }

        // right mouse up
        if (e.button === RIGHT_MOUSE_BUTTON) {
            setIsArrowing(false);
        }
    }

    // we attach the handler specifically to the wrapper to correctly process mouseUp during movement,
    // as attaching this handler to a child component would lead to incorrect behavior
    // when moving the mouse quickly (i.e., if it moves outside the component's boundaries)
    function wrapperDivMouseMoveHandler(e: React.MouseEvent) {
        e.preventDefault();
        if (isMoving) {
            moveCanvas({
                e,
                movingPoint,
                dispatchDivOffset,
                scale,
            });

            setMovingPoint({ x: e.clientX, y: e.clientY });
        } else if (isSelecting) {
            setSelectingEndingPoint({
                x: e.clientX,
                y: e.clientY,
            });
        } else if (isDragging) {
            dragShape({ e, draggingPoint, setShapes, scale });

            setDraggingPoint({ x: e.clientX, y: e.clientY });
        } else if (isArrowing) {
            const realMouseCoords = getRealMouseCoords(e);

            makeArrow({
                currentArrow,
                arrows,
                realMouseCoords,
                arrowType,
                arrowingStartPoint,
                arrowingFinishPoint,
                arrowingStartShapeId,
                arrowingFinishShapeId,
                setArrows,
                setCurrentArrow,
                setArrowingFinishPoint,
            });
        } else if (isResizing) {
            const realMouseCoords = getRealMouseCoords(e);

            resizeShape({
                e,
                resizingPoint,
                resizingDirection,
                resizingShapeId,
                setResizingDirection,
                setShapes,
                realMouseCoords,
                scale,
            });

            setResizingPoint({ x: e.clientX, y: e.clientY });
        }
    }

    // scrolling
    function wrapperDivWheelHandler(e: React.WheelEvent) {
        const realMouseCoords = getRealMouseCoords(e);

        scaleScroll({
            e,
            setScale,
            realMouseCoords,
            dispatchDivOffset,
        });
    }
    // endregion

    // region functions
    function getVirtualMouseCoords(e: React.MouseEvent): {
        x: number;
        y: number;
    } {
        const infiniteDivBoundingClientRect =
            divRef.current!.getBoundingClientRect();

        // coordinates relative to the top-left corner (virtual coordinates)
        const virtualX = Math.round(
            (e.clientX - infiniteDivBoundingClientRect.left) / scale
        );
        const virtualY = Math.round(
            (e.clientY - infiniteDivBoundingClientRect.top) / scale
        );

        return { x: virtualX, y: virtualY };
    }

    function getRealMouseCoords(e: React.MouseEvent) {
        const virtualMouseCoords = getVirtualMouseCoords(e);
        return {
            x: toRealX(virtualMouseCoords.x),
            y: toRealY(virtualMouseCoords.y),
        };
    }

    // endregion

    // region callbacks

    const getCenterOfWrapperVirtualCoords = useCallback(() => {
        const wrapperDivBoundingClientRect =
            wrapperRef.current!.getBoundingClientRect();
        const infiniteDivBoundingClientRect =
            divRef.current!.getBoundingClientRect();

        const clientXFromKeyboard =
            wrapperDivBoundingClientRect.width / 2 +
            wrapperDivBoundingClientRect.x;

        const clientYFromKeyboard =
            wrapperDivBoundingClientRect.height / 2 +
            wrapperDivBoundingClientRect.y;

        // coordinates relative to the top-left corner (virtual coordinates)
        const virtualX = Math.round(
            (clientXFromKeyboard - infiniteDivBoundingClientRect.left) / scale
        );

        const virtualY = Math.round(
            (clientYFromKeyboard - infiniteDivBoundingClientRect.top) / scale
        );

        return { x: virtualX, y: virtualY };
    }, [scale]);

    const getCenterOfWrapperRealCoords = useCallback(() => {
        const virtualCoords = getCenterOfWrapperVirtualCoords();
        return {
            x: toRealX(virtualCoords.x),
            y: toRealY(virtualCoords.y),
        };
    }, [getCenterOfWrapperVirtualCoords]);

    const keyboardScale = useCallback(
        (direction: KeyboardScaleType) => {
            setScale((prev) => {
                const scaleAmount =
                    direction === KeyboardScaleType.plus ? 0.2 : -0.2;
                const newScale =
                    Math.round(
                        Math.min(
                            Math.max(MIN_SCALE, prev + scaleAmount),
                            MAX_SCALE
                        ) * 100
                    ) / 100;

                if (prev - newScale === 0) {
                    return prev;
                }

                const realWrapperCenterCoords = getCenterOfWrapperRealCoords();

                dispatchDivOffset({
                    type: DivOffsetReducerType.keyboardScale,
                    payload: {
                        divDefaultWidth: UX_CANVAS_DIV_DEFAULT_WIDTH,
                        divDefaultHeight: UX_CANVAS_DIV_DEFAULT_HEIGHT,
                        newScale,
                        scaleAmount,
                        realWrapperCenterCoords,
                        wrapperWidth: UX_CANVAS_WRAPPER_WIDTH,
                        wrapperHeight: UX_CANVAS_WRAPPER_HEIGHT,
                    },
                });

                return newScale;
            });
        },
        [getCenterOfWrapperRealCoords]
    );

    const removeSelectedShapes = useCallback(() => {
        const selectedShapesIds = shapes
            .filter((shape) => shape.isSelected)
            .map((shape) => shape.id);

        // remove all arrows from selected shapes
        setArrows((prev) => {
            const result: Arrow[] = [];

            for (const arrow of prev) {
                if (
                    !selectedShapesIds.find(
                        (shId) => shId === arrow.shapeIdStart
                    ) &&
                    !selectedShapesIds.find(
                        (shId) => shId === arrow.shapeIdFinish
                    )
                ) {
                    result.push(arrow);
                }
            }

            return result;
        });

        setShapes((prev) => {
            return prev.filter((shape) => !shape.isSelected);
        });
    }, [shapes]);

    const removeSelectedArrows = useCallback(() => {
        setArrows((prev) => {
            return prev.filter((arrow) => !arrow.isSelected);
        });
    }, []);

    const selectAllShapes = useCallback(() => {
        setShapes((prev) => {
            prev.forEach((shape) => (shape.isSelected = true));
            return [...prev];
        });
    }, []);

    const deselectAllShapes = useCallback(() => {
        setShapes((prev) => {
            prev.forEach((shape) => {
                shape.isSelected = false;
                shape.isEditing = false;
            });

            return [...prev];
        });
    }, []);

    const deselectAllArrows = useCallback(() => {
        setArrows((prev) => {
            prev.forEach((arrow) => (arrow.isSelected = false));

            return [...prev];
        });
    }, []);

    const areThereEditingShapes = useCallback(() => {
        return shapes.filter((s) => s.isEditing).length > 0;
    }, [shapes]);

    // endregion

    // region effects
    useEffect(() => {
        const keyDownEventListener = (e: KeyboardEvent) => {
            if (areThereEditingShapes()) {
                return;
            }
            if (e.key === '=') {
                keyboardScale(KeyboardScaleType.plus);
            } else if (e.key === '-') {
                keyboardScale(KeyboardScaleType.minus);
            } else if (e.key === 'Backspace') {
                removeSelectedShapes();
                removeSelectedArrows();
            } else if (e.code === 'KeyA' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                selectAllShapes();
            } else if (e.key === 'Escape') {
                deselectAllShapes();
            }
        };

        const keyUpEventListener = (e: KeyboardEvent) => {};

        window.addEventListener('keydown', keyDownEventListener);
        window.addEventListener('keyup', keyUpEventListener);

        return () => {
            window.removeEventListener('keydown', keyDownEventListener);
            window.removeEventListener('keyup', keyUpEventListener);
        };
    }, [
        areThereEditingShapes,
        deselectAllShapes,
        keyboardScale,
        removeSelectedArrows,
        removeSelectedShapes,
        scale,
        selectAllShapes,
    ]);

    useEffect(() => {
        console.log(shapes);
    }, [shapes]);

    useEffect(() => {
        handleMount(editor);
        setShapes(editor.getAllShapes());
        setArrows(editor.getAllArrows());
        setArbitraries(editor.getAllArbitraries());

        return () => {
            editor.removeAllShapes();
            editor.removeAllArrows();
            editor.removeAllArbitraries();
        };
    }, [handleMount]);

    // endregion

    // region memos

    const refsContextValueObject = useMemo(() => {
        return {
            wrapperRef,
            divRef,
        };
    }, []);

    const draggingContextValueObject = useMemo(() => {
        return {
            setIsDragging,
            setDraggingPoint,
        };
    }, []);

    const shapesContextValueObject = useMemo(() => {
        return {
            shapes,
            setShapes,
        };
    }, [shapes]);

    const arrowsContextValueObject = useMemo(() => {
        return {
            arrows,
            setArrows,
            isArrowing,
            setIsArrowing,
            setArrowType,
            arrowType,
            setArrowingStartPoint,
            setArrowingFinishPoint,
            setArrowingStartShapeId,
            setArrowingFinishShapeId,
        };
    }, [arrowType, arrows, isArrowing]);

    const scaleContextValueObject = useMemo(() => {
        return {
            scale,
        };
    }, [scale]);

    const resizingContextValueObject = useMemo(() => {
        return {
            setIsResizing,
            setResizingDirection,
            setResizingShapeId,
            setResizingPoint,
        };
    }, []);

    // endregion

    return (
        <UxCanvasProvider
            refsContextValueObject={refsContextValueObject}
            draggingContextValueObject={draggingContextValueObject}
            shapesContextValueObject={shapesContextValueObject}
            arrowsContextValueObject={arrowsContextValueObject}
            scaleContextValueObject={scaleContextValueObject}
            resizingContextValueObject={resizingContextValueObject}>
            <div
                className={styles['wrapper']}
                ref={wrapperRef}
                style={{
                    width: UX_CANVAS_WRAPPER_WIDTH,
                    height: UX_CANVAS_WRAPPER_HEIGHT,
                    cursor: isMoving ? 'grab' : 'default',
                }}
                onMouseDown={wrapperDivMouseDownHandler}
                onMouseUp={wrapperDivMouseUpHandler}
                onMouseMove={wrapperDivMouseMoveHandler}
                onWheel={wrapperDivWheelHandler}>
                <div
                    className={styles['infinite-div']}
                    ref={divRef}
                    style={{
                        width: UX_CANVAS_DIV_DEFAULT_WIDTH,
                        height: UX_CANVAS_DIV_DEFAULT_HEIGHT,
                        left: divOffset.x,
                        top: divOffset.y,
                        transform: `scale(${scale})`,
                    }}>
                    <GriddedCoordsSystem />
                    <FunctionSamples />
                    <button
                        onClick={() => setCount((prev) => prev + 1)}
                        style={{
                            position: 'absolute',
                            left: toVirtualX(-300),
                            top: toVirtualY(300),
                        }}>
                        COUNT: {count}
                    </button>
                    {shapes.length > 0 && shapes.map((sh) => sh.component())}
                    {arrows.length > 0 && arrows.map((ar) => ar.component())}
                    {arbitraries.length > 0 &&
                        arbitraries.map((gen) => gen.component())}
                </div>
                {isSelecting && selectingPoint && selectingEndingPoint && (
                    <SelectArea
                        startingPoint={selectingPoint}
                        endingPoint={selectingEndingPoint}
                        scale={scale}
                    />
                )}
                <CoordsDebugInfo
                    scale={scale}
                    offsetX={divOffset.x}
                    offsetY={divOffset.y}
                />
                <CanvasStateDebugInfo
                    scale={scale}
                    isSelecting={isSelecting}
                    isMoving={isMoving}
                    isDragging={isDragging}
                />
                {/*<AbsoluteCenter />*/}
            </div>
        </UxCanvasProvider>
    );
};

export default UXCanvas;
