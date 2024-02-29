import React, { useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import '../timeNode/time-node.css';

const TimeNode = ({ data, isConnectable }) => {
    const updateNodeInternals = useUpdateNodeInternals();
    const nodeRef = useRef();

    useEffect(() => {
        updateNodeInternals(data.id);
    }, [data.answers, data.id, updateNodeInternals]);

    const nonEmptyAnswers = data.answers.filter(answer => answer !== '');

    return (
        <div className="time-node" ref={nodeRef}>
            <Handle type='target' position={Position.Top} isConnectable={isConnectable} />

            <div>
                <label htmlFor="text">{data.label}</label>
            </div>

            <div className='time-node-source-handles'>
                {nonEmptyAnswers.map((answerData, index) => {
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
                            <div className="handle-label">{answerData.answer}</div>
                        </Handle>
                    );
                })}

            </div>
        </div>
    );
};

export default TimeNode;
