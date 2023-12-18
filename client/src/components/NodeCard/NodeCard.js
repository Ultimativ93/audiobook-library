import React from 'react';
import './NodeCard.css';

const NodeCard = ({ index }) => {
  console.log(index, 'index Jungeeee')
  return (
    <div className='node-card'>Knoten Nummer: {index}</div>
  );
};



export default NodeCard;
