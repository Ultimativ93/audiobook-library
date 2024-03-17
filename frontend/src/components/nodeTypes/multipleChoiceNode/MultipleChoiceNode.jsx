import React, { useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import '../multipleChoiceNode/multiple-choice-node.css';

const MultipleChoiceNode = ({ data, isConnectable }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const nodeRef = useRef();

  useEffect(() => {
    updateNodeInternals(data.id);
  }, [data.answers, data.id, updateNodeInternals]);

  const nonEmptyAnswers = data.answers.filter(answer => answer !== '');

  // Add handles for each answer
  const handles = nonEmptyAnswers.map((answer, index) => {
    const handleId = `${data.id}-handle-${index}`;
    const totalWidth = 200;
    const leftPosition = (index / (nonEmptyAnswers.length - 1)) * totalWidth;
    return (
      <Handle
        key={handleId}
        type="source"
        position={Position.Bottom}
        id={handleId}
        isConnectable={isConnectable}
        style={{ left: `${leftPosition}px` }}
      >
        <div className="handle-label">{answer}</div>
      </Handle>
    );
  });

  return (
    <div className="multiple-choice-node" ref={nodeRef}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div>
        <label htmlFor="text" className="node-label">{data.label}</label>
      </div>

      <div className="multiple-choice-node-source-handles">
        {handles}
      </div>
    </div>
  );
};

export default MultipleChoiceNode;