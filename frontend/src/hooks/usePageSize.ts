import { useEffect, useState } from 'react';

export function usePageSize() {
    const [pageSize, setPageSize] = useState<{
        width: number;
        height: number;
    }>({
        width: getWidth(),
        height: getHeight(),
    });

    useEffect(() => {
        const handleResize = () => {
            setPageSize({
                width: getWidth(),
                height: getHeight(),
            });
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return pageSize;
}

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}
