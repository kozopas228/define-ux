import React, { memo, useContext, useEffect, useState } from 'react';
import { toVirtualX, toVirtualY } from '../util';

const MathFunctionSamples = () => {
    console.log('render function samples');

    const [linearFunctionDots, setLinearFunctionDots] = useState<
        { x: number; y: number }[]
    >([]);
    const [logFunctionDots, setLogFunctionDots] = useState<
        { x: number; y: number }[]
    >([]);
    const [constantFunctionDots, setConstantunctionDots] = useState<
        { x: number; y: number }[]
    >([]);
    const [nlogFunctionDots, setNlogFunctionDots] = useState<
        { x: number; y: number }[]
    >([]);
    const [squareFunctionDots, setSquareFunctionDots] = useState<
        { x: number; y: number }[]
    >([]);

    useEffect(() => {
        function linearFunction(x: number): number {
            return x;
        }

        function log2NFunction(x: number): number {
            return Math.log2(x);
        }

        function nLogN(x: number): number {
            return x * log2NFunction(x);
        }

        function nSquare(x: number): number {
            return x ** 2;
        }

        const constantDots = [];
        const linearDots = [];
        const log2NDots = [];
        const logN2NDots = [];
        const squareDots = [];

        for (let x = -500; x < 500; x++) {
            const constantY = 1;
            constantDots.push({ x: x, y: constantY });

            const linearY = linearFunction(x);
            linearDots.push({ x: x, y: linearY });

            const log2NY = log2NFunction(x);
            log2NDots.push({ x: x, y: log2NY });

            const logN2NY = nLogN(x);
            logN2NDots.push({ x: x, y: logN2NY });

            const squareY = nSquare(x);
            squareDots.push({ x: x, y: squareY });
        }

        setConstantunctionDots(constantDots);
        setLinearFunctionDots(linearDots);
        setLogFunctionDots(log2NDots);
        setNlogFunctionDots(logN2NDots);
        setSquareFunctionDots(squareDots);
    }, []);

    return (
        <>
            {constantFunctionDots.length > 0 &&
                constantFunctionDots.map((dot) => {
                    return (
                        <svg
                            key={JSON.stringify(dot)}
                            height='5'
                            width='5'
                            style={{
                                position: 'absolute',
                                left: toVirtualX(dot.x),
                                top: toVirtualY(dot.y),
                            }}>
                            <circle
                                r='2'
                                fill='green'
                            />
                        </svg>
                    );
                })}
            {linearFunctionDots.length > 0 &&
                linearFunctionDots.map((dot) => {
                    return (
                        <svg
                            key={JSON.stringify(dot)}
                            height='5'
                            width='5'
                            style={{
                                position: 'absolute',
                                left: toVirtualX(dot.x),
                                top: toVirtualY(dot.y),
                            }}>
                            <circle
                                r='2'
                                fill='red'
                            />
                        </svg>
                    );
                })}
            {logFunctionDots.length > 0 &&
                logFunctionDots.map((dot) => {
                    return (
                        <svg
                            key={JSON.stringify(dot)}
                            height='5'
                            width='5'
                            style={{
                                position: 'absolute',
                                left: toVirtualX(dot.x),
                                top: toVirtualY(dot.y),
                            }}>
                            <circle
                                r='2'
                                fill='blue'
                            />
                        </svg>
                    );
                })}
            {nlogFunctionDots.length > 0 &&
                nlogFunctionDots.map((dot) => {
                    return (
                        <svg
                            key={JSON.stringify(dot)}
                            height='10'
                            width='10'
                            style={{
                                position: 'absolute',
                                left: toVirtualX(dot.x),
                                top: toVirtualY(dot.y),
                            }}>
                            <circle
                                r='5'
                                fill='aquamarine'
                            />
                        </svg>
                    );
                })}
            {squareFunctionDots.length > 0 &&
                squareFunctionDots.map((dot) => {
                    return (
                        <svg
                            key={JSON.stringify(dot)}
                            height='25'
                            width='25'
                            style={{
                                position: 'absolute',
                                left: toVirtualX(dot.x),
                                top: toVirtualY(dot.y),
                            }}>
                            <circle
                                r='5'
                                cx='5'
                                cy='5'
                                fill='brown'
                            />
                        </svg>
                    );
                })}
        </>
    );
};

export default memo(MathFunctionSamples);
