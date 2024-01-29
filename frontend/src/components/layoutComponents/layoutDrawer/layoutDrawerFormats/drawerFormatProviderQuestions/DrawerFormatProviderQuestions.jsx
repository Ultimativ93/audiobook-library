import React from 'react';

import MuChoiFormatQuestions from './MuChoiFormatQuestions';
import TimeNodeFormatQuestions from './TimeNodeFormatQuestions';
import MuAnsFormatQuestions from './MuAnsFormatQuestions';

const DrawerFormatProviderQuestions = ({ nodeData, setNodes, setEdges, edges }) => {

    switch (nodeData.type) {
        case 'start':
            return {
                // has to be created
            }
        case 'muChoi':
            return (
                <MuChoiFormatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges}/>
            )
        case 'timeNode':
            return (
                <TimeNodeFormatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} />
            )
            case 'muAns':
                return (
                    <MuAnsFormatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} />
                )
        default:
            console.log("Default in LayoutFormatProvider, check it!");
            // create default functionality
            return null;
    }
}

export default DrawerFormatProviderQuestions;
