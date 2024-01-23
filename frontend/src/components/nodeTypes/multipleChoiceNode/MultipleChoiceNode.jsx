import { Handle, Position } from 'reactflow';
import '../multipleChoiceNode/multiple-choice-node.css'

function MultipleChoiceNode({ data, isConnectable }) {
  console.log("Data in MuChoiNode: ", data);
  console.log("data.answers: ", data.answers)
  console.log("data.answers.id: ", data.answers[1]);

  return (
    <div className="multiple-choice-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">{data.label}</label>
      </div>
      <div className='multiple-choice-node-source-handles'>
        {data.answers.map((answer, index) => {
          console.log("Answer in answers:", answer);
          return (
            
            <Handle
              key={index}
              type="source"
              position={Position.Bottom}
              id={answer.id}
              style={{ left: `${(index + 1) * 33}%` }}
              isConnectable={isConnectable}
            />
          )
        })}
      </div>
    </div>
  );
}

export default MultipleChoiceNode;
