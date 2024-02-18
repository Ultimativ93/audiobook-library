import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';

import './end-node.css';

const EndNode = ({ data, isConnectable }) => {
    const nodeRef = useRef(null);

    return (
            <div className="end-node" ref={nodeRef}>
                <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
                <div>
                    <label htmlFor="text">{data.label}</label>
                </div>
            </div>
    );
};

export default EndNode;