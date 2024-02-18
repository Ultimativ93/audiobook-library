import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';

import './bridge-node.css';

const BridgeNode = ({ data, isConnectable }) => {
    const nodeRef = useRef(null);

    return (
            <div className="bridge-node" ref={nodeRef}>
                <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
                <div>
                    <label htmlFor="text">{data.label}</label>
                </div>
                <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
            </div>
    );
};

export default BridgeNode;