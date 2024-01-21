import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import '../multipleChoiceNode/multiple-choice-node.css'

function MultipleChoiceNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="multiple-choice-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">{data.label}</label>
      </div>
      <div className='multiple-choice-node-source-handles'>
        <Handle type="source" position={Position.Bottom} id="a" style={{left: '33%'}} isConnectable={isConnectable} />
        <Handle type="source" position={Position.Bottom} id="b" style={{ left: '66%'}} isConnectable={isConnectable} />
      </div>
    </div>
  );
}

export default MultipleChoiceNode;
