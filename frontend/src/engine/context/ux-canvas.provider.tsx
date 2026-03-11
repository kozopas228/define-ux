import React from 'react';
import { DraggingContext, draggingContextType } from './dragging.context';
import { ShapesContext, shapesContextType } from './shapes.context';
import { ArrowsContext, arrowsContextType } from './arrows.context';
import { ScaleContext, scaleContextType } from './scale.context';
import { RefsContext, refsContextType } from './refs.context';
import { ResizingContext, resizingContextType } from './resizing.context';

interface IProps {
    refsContextValueObject: refsContextType;
    draggingContextValueObject: draggingContextType;
    shapesContextValueObject: shapesContextType;
    arrowsContextValueObject: arrowsContextType;
    scaleContextValueObject: scaleContextType;
    resizingContextValueObject: resizingContextType;
    children: React.ReactNode;
}

const UxCanvasProvider = ({
    refsContextValueObject,
    draggingContextValueObject,
    shapesContextValueObject,
    arrowsContextValueObject,
    scaleContextValueObject,
    resizingContextValueObject,
    children,
}: IProps) => {
    return (
        <RefsContext.Provider value={refsContextValueObject}>
            <DraggingContext.Provider value={draggingContextValueObject}>
                <ShapesContext.Provider value={shapesContextValueObject}>
                    <ArrowsContext.Provider value={arrowsContextValueObject}>
                        <ScaleContext.Provider value={scaleContextValueObject}>
                            <ResizingContext.Provider
                                value={resizingContextValueObject}>
                                {children}
                            </ResizingContext.Provider>
                        </ScaleContext.Provider>
                    </ArrowsContext.Provider>
                </ShapesContext.Provider>
            </DraggingContext.Provider>
        </RefsContext.Provider>
    );
};

export default UxCanvasProvider;
