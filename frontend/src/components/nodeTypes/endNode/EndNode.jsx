import React from 'react';
import { Handle, Position } from 'reactflow';

import '../endNode/end-node.css';

const EndNode = ({ data, isConnectable }) => {
    return (
        <div className="end-node">

            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

            <div>
                <label htmlFor="text">{data.label}</label>
            </div>
        </div>
    );
};

export default EndNode;