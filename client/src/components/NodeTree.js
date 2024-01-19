import React from 'react';
import NodeCard from './NodeCard/NodeCard';

const NodeTree = () => {
  const nodes = [1, 2, 3, 4, 5];

  return (
    <div>
      {nodes.map((nodeIndex) => (
        <NodeCard key={nodeIndex} index={nodeIndex} />
      ))}
    </div>
  );
};

export default NodeTree;
