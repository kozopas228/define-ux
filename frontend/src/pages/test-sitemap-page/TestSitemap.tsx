import React, { useEffect, useState } from 'react';
import { SiteCard } from './types/SiteCard';
import { getSiteCards } from './getSiteCards';
import UXCanvas from '../../engine/UXCanvas';
import { UxEditor } from '../../engine/ux-editor';
import { SquareShapeObject } from '../../engine/shapes/default-shapes/square/SquareShapeObject';
import { StraightArrowObject } from '../../engine/arrows/straight/StraightArrowObject';
import { CircleShapeObject } from '../../engine/shapes/default-shapes/circle/CircleShapeObject';

const TestSitemap = () => {
    const [siteCards, setSiteCards] = useState<SiteCard[]>([]);

    function handleMount(editor: UxEditor) {
        editor.addShape(
            new SquareShapeObject({
                id: '4ce11a61-26dc-4afc-82cd-905a6c8d3558',
                coords: { x: 0, y: 0 },
                text: 'ahaaha test 3213123',
                width: 300,
                height: 700,
            }),
            new SquareShapeObject({
                id: '91fe9ec1-e22d-4504-be9e-073130393cbb',
                coords: { x: 300, y: 100 },
                text: 'test test test ',
            }),
            new SquareShapeObject({
                id: 'ec5edda4-a88d-4568-9b27-6661b93bcdd3',
                coords: { x: 2000, y: 1030 },
                text: '32131 123 asd asd asfasd',
            })
        );

        editor.addArrow(
            new StraightArrowObject({
                id: '3a0fe094-7079-47b5-8bd9-2b7bb654a292',
                shapeIdStart: '4ce11a61-26dc-4afc-82cd-905a6c8d3558',
                shapeIdFinish: '91fe9ec1-e22d-4504-be9e-073130393cbb',
            })
        );

        editor.addArrow(
            new StraightArrowObject({
                id: '0147e4ed-876c-4d6b-be7f-10cffa7d6ed3',
                coordsStart: { x: 300, y: 400 },
                coordsFinish: { x: 500, y: 100 },
            })
        );

        editor.addShape(
            new CircleShapeObject({
                id: '903b6558-a3d7-4011-b83a-a503482c2cf8',
                coords: { x: 123, y: 800 },
            }),
            new CircleShapeObject({
                id: '2a5fbb2b-7c01-49da-8829-3f40fecc903b',
                coords: { x: 1233, y: 321 },
            }),
            new CircleShapeObject({
                id: '3af8876c-816f-4077-8a22-6cf4a73de74d',
                coords: { x: 412, y: -44 },
            })
        );

        editor.createNewShape(SquareShapeObject, {
            x: 1000,
            y: 1337,
        });
        editor.createNewShape(SquareShapeObject, {
            x: 1000,
            y: 1337,
        });
        editor.createNewShape(SquareShapeObject, {
            x: 1000,
            y: 1337,
        });
        editor.createNewShape(SquareShapeObject, {
            x: 1000,
            y: 1337,
        });

        editor.createNewShape(CircleShapeObject, {
            x: 2000,
            y: -2000,
        });
    }

    useEffect(() => {
        let ignore = false;
        setSiteCards([]);
        getSiteCards().then((result) => {
            if (!ignore) {
                setSiteCards(result);
            }
        });

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            {siteCards.length > 0 ? (
                <UXCanvas handleMount={handleMount} />
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
};

export default TestSitemap;
