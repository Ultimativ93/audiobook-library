import React, { useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import '../multipleChoiceNode/multiple-choice-node.css';

const MultipleChoiceNode = ({ data, isConnectable }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const nodeRef = useRef();

  useEffect(() => {
    updateNodeInternals(data.id);
  }, [data.answers, data.id, updateNodeInternals]);

  // Filtern Sie leere Strings aus den Antworten
  const nonEmptyAnswers = data.answers.filter(answer => answer !== '');

  return (
    <div className="multiple-choice-node" ref={nodeRef}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div>
        <label htmlFor="text">{data.label}</label>
      </div>

      <div className='multiple-choice-node-source-handles'>
        {nonEmptyAnswers.map((answer, index) => {
          const handleId = `${data.id}-handle-${index}`;
          const totalWidth = 200; // Anpassen Sie dies an die Breite Ihrer Node
          const leftPosition = (index / (nonEmptyAnswers.length - 1)) * totalWidth;

          return (
            <Handle
              key={handleId}
              type="source"
              position={Position.Bottom}
              id={handleId}
              isConnectable={isConnectable}
              style={{ left: `${leftPosition}px` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceNode;