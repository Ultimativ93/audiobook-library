import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';
import useNodeOverlapCheck from '../../tasks/editorTasks/useNodeOverlapCheck.js';

import './bridge-node.css';
import useStore from '../../tasks/store.js'; 

const BridgeNode = ({ data, isConnectable }) => {
    const nodeRef = useRef(null);
    const setNodes = useStore((state) => state.setNodes);
    const setEdges = useStore((state) => state.setEdges);
    const { nodes } = useStore(); 
    console.log("nodes in Bridge", nodes);

    const handleOverlap = (overlapping) => {
        if (overlapping) {
            console.log("is Overlapping");

            
            const dialogNode = nodes.find((node) => node.type === 'dialogNode');

            if (dialogNode) {
                
                const newNode = {
                    id: `${dialogNode.id}-bridge`,
                    data: { label: 'Bridge Node' },
                    position: { x: dialogNode.position.x + 100, y: dialogNode.position.y + 100 },
                };
                console.log("sind wir hier?")
                
                setNodes((prevNodes) => [...prevNodes, newNode]);
                setEdges((prevEdges) => [...prevEdges, { id: `${dialogNode.id}-bridge-edge`, source: dialogNode.id, target: newNode.id }]);
            }
        }
    };

    const isOverlapping = useNodeOverlapCheck(nodeRef, handleOverlap);

    return (
        <div className={`bridge-node ${isOverlapping ? 'overlapping' : ''}`} ref={nodeRef}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div>
                <label htmlFor="text">{data.label}</label>
            </div>
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
        </div>
    );
};

export default BridgeNode;
