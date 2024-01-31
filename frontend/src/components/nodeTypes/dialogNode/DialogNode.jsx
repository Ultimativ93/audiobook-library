import React from 'react';
import { Handle, Position } from 'reactflow';
import "../dialogNode/dialog-node.css";

const DialogNode = ({ data, isConnectable }) => {

    return (
        <div className="dialog-node">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div>
                <label htmlFor="text">{data.label}</label>
            </div>

            <div className="dialog-node-source-handles">
                <Handle type="source" id={data.id} position={Position.Bottom} isConnectable={isConnectable} />
            </div>
        </div>
    );
};

export default DialogNode;
