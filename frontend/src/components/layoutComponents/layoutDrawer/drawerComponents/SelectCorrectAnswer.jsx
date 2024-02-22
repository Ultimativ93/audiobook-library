import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectCorrectAnswer = ({ nodeData, setNodes }) => {
    const [correctAnswer, setCorrectAnswer] = useState(nodeData.data.correctAnswer);

    const handleInputChange = (newCorrectAnswer) => {
        if (newCorrectAnswer !== null && newCorrectAnswer !== undefined) {
            setCorrectAnswer(newCorrectAnswer);
            updateNodeProperty(setNodes, nodeData, 'correctAnswer', newCorrectAnswer);
        }
    };

    const handleRemoveAnswer = () => {
        setCorrectAnswer('');
        updateNodeProperty(setNodes, nodeData, 'correctAnswer', '');
    }
    
    return (
        <>
            <h4 style={{ marginTop:'5px'}}>Set Correct Answer</h4>
            <Input
                placeholder='Correct Answer ..'
                value={correctAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
            />
            <Button
                colorScheme='red'
                size='sm'
                onClick={() => handleRemoveAnswer()}
            >
                Remove Answer
            </Button>
        </>
    )
};

export default SelectCorrectAnswer;
