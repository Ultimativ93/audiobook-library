import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import '../multipleAnswerNode/multiple-answer-node.css';

const MultipleAnswerNode = ({ data, isConnectable }) => {
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        updateNodeInternals(data.id);
    }, [data.answerCombinations, data.id, updateNodeInternals]);

    const totalWidth = 200;

    return (
        <div className="multiple-answer-node">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

            <div>
                <label htmlFor="text">{data.label}</label>
            </div>

            <div className="multiple-choice-node-source-handles">
                {data.answerCombinations.map((combination, index) => {
                    const handleId = `${data.id}-handle-${index}`;
                    const leftPosition = (index / (data.answerCombinations.length - 1)) * totalWidth;

                    const answersString = combination.answers.join(', ');

                    return (
                        <Handle
                            key={handleId}
                            type="source"
                            position={Position.Bottom}
                            id={handleId}
                            isConnectable={isConnectable}
                            style={{ left: `${leftPosition}px` }}
                        >
                            <div className="handle-label">{answersString}</div>
                        </Handle>
                    );
                })}
            </div>
        </div>
    );
};

export default MultipleAnswerNode;
