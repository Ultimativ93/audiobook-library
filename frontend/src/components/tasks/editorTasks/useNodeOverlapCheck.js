import { useEffect, useRef, useState } from 'react';

const useNodeOverlapCheck = (nodeRef, onOverlap) => {
    const [isOverlapping, setIsOverlapping] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (nodeRef.current) {
                const bridgeRect = nodeRef.current.getBoundingClientRect();

                const dialogNodes = document.querySelectorAll('.dialog-node');
                let overlapping = false;

                dialogNodes.forEach((dialogNode) => {
                    const dialogRect = dialogNode.getBoundingClientRect();
                    if (
                        bridgeRect.x < dialogRect.x + dialogRect.width &&
                        bridgeRect.x + bridgeRect.width > dialogRect.x &&
                        bridgeRect.y < dialogRect.y + dialogRect.height &&
                        bridgeRect.y + bridgeRect.height > dialogRect.y
                    ) {
                        overlapping = true;
                    }
                });

                if (overlapping !== isOverlapping) {
                    setIsOverlapping(overlapping);
                    onOverlap(overlapping, event); // Pass the event here
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isOverlapping, nodeRef, onOverlap]);

    return isOverlapping;
};

export default useNodeOverlapCheck;
