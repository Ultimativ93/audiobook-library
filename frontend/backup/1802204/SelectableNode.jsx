import React, { useRef, useState, useEffect } from 'react';

const SelectableNode = ({ children }) => {
    const nodeRef = useRef(null);
    const [selectedNodes, setSelectedNodes] = useState(new Set());
    const [originalBackgroundColor, setOriginalBackgroundColor] = useState('');

    const handleNodeClick = (event) => {
        const nodeId = nodeRef.current.dataset.nodeId;
        const updatedSelection = new Set(selectedNodes);
    
        if (!event.ctrlKey) {
            updatedSelection.clear();
            updatedSelection.add(nodeId);
        } else {
            if (updatedSelection.has(nodeId)) {
                updatedSelection.delete(nodeId);
            } else {
                updatedSelection.add(nodeId);
            }
        }
    
        setSelectedNodes(updatedSelection);
    };

    const handleWindowClick = (event) => {
        if (nodeRef.current && !nodeRef.current.contains(event.target)) {
            setSelectedNodes(new Set());
        }
    };

    useEffect(() => {
        window.addEventListener('click', handleWindowClick);

        setOriginalBackgroundColor(getComputedStyle(nodeRef.current).getPropertyValue('--node-background-color'));

        return () => {
            window.removeEventListener('click', handleWindowClick);
        };
    }, []);

    useEffect(() => {
        nodeRef.current.style.setProperty(
            '--node-background-color',
            selectedNodes.has(nodeRef.current?.dataset.nodeId) ? 'orange' : originalBackgroundColor
        );
    }, [selectedNodes, originalBackgroundColor]);

    return (
        <div
            ref={nodeRef}
            onClick={handleNodeClick}
            style={{
                '--node-background-color': selectedNodes.has(nodeRef.current?.dataset.nodeId) ? 'orange' : originalBackgroundColor,
            }}
        >
            {children}
        </div>
    );
};

export default SelectableNode;
