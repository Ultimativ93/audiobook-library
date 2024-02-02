import React, { useRef } from 'react';
import { Handle, Position } from 'reactflow';

import '../inputNode/input-node.css';

const InputNode = ({ data, isConnectable }) => {
  const nodeRef = useRef();

  const totalWidth = 200; // Adjust this value based on your layout

  return (
    <div className="input-node" ref={nodeRef}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div>
        <label htmlFor="text">{data.label}</label>
      </div>

      <div className="input-node-source-handles">
        {[0, 1, 2].map((index) => {
          const handleId = `${data.id}-handle-${index}`;
          const leftPosition = (index / 2) * totalWidth;

          let handleStyle = {};
          if (index === 0) {
            handleStyle = {backgroundColor: 'red'};
          } else if (index === 1) {
            handleStyle = {backgroundColor: 'green'};
          }

          return (
            <Handle
              key={handleId}
              type="source"
              position={Position.Bottom}
              id={handleId}
              isConnectable={isConnectable}
              style={{ left: `${leftPosition}px`, ...handleStyle }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InputNode;
