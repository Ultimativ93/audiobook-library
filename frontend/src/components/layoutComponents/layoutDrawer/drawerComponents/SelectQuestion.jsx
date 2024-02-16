import React from 'react'
import { Input } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectQuestion = ({ nodeData, setNodes }) => {
    const handleQuestionChange = (event) => {
        const newQuestion = event.target.value;
        updateNodeProperty(setNodes, nodeData, 'question', newQuestion);
    };

    return (
        <>
            <h4>Set Question</h4>
            <Input
                placeholder='Question ..'
                defaultValue={nodeData.data.question}
                onChange={handleQuestionChange}
            />
        </>
    )
}

export default SelectQuestion;
