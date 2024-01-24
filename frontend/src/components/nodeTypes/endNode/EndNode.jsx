import React from 'react';
import { Handle, Position } from 'reactflow';

import '../endNode/end-node.css';

const EndNode = (data, isConnectable) => {
    console.log("data in end",data)
    return (
        <div className="end-node">

            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

            <div>
                <label htmlFor="text">{data.data.label}</label>
            </div>
        </div>
    );
};

export default EndNode;