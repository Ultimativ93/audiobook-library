import React from 'react'
import { Input } from '@chakra-ui/react';

import './drawer-components.css'

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectQuestion = ({ nodeData, setNodes }) => {
    const handleQuestionChange = (event) => {
        const newQuestion = event.target.value;
        updateNodeProperty(setNodes, nodeData, 'question', newQuestion);
    };

    return (
        <div className="question-container">
            <h4>Set Question</h4>
            <Input
                placeholder='Question ..'
                defaultValue={nodeData.data.question}
                onChange={handleQuestionChange}
                focusBorderColor='darkButtons'
            />
        </div>
    )
}

export default SelectQuestion;
