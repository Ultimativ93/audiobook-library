import React, { useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import '../reactionNode/reaction-node.css';

const ReactionNode = ({ data, isConnectable }) => {
    const updateNodeInternals = useUpdateNodeInternals();
    const nodeRef = useRef();

    useEffect(() => {
        updateNodeInternals(data.id);
    }, [data.answerPeriods, data.id, updateNodeInternals]);

    const nonEmptyAnswers = data.answerPeriods.filter(answer => answer !== '');
    const handleNoReaction = { start: '', end: '', answer: 'NoReaction' };

    nonEmptyAnswers.push(handleNoReaction);

    return (
        <div className="reaction-node" ref={nodeRef}>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

            <div className="label">
                <label htmlFor="text">{data.label}</label>
            </div>

            <div className="reaction-node-source-handles">
                {nonEmptyAnswers.map((answer, index) => {
                    const handleId = `${data.id}-handle-${index}`;
                    const totalWidth = 200;
                    const leftPosition = (index / (nonEmptyAnswers.length - 1)) * totalWidth;

                    const handleStyle = {
                        left: `${leftPosition}px`,
                        backgroundColor: index === nonEmptyAnswers.length - 1 ? '#e60000' : '#423f40',
                    };

                    return (
                        <Handle
                            key={handleId}
                            type="source"
                            position={Position.Bottom}
                            id={handleId}
                            isConnectable={isConnectable}
                            style={handleStyle}
                            className="react-flow__handle"
                        >
                            <div className="handle-label">{answer.answer}</div>
                        </Handle>
                    );
                })}
            </div>
        </div>
    );
};

export default ReactionNode;