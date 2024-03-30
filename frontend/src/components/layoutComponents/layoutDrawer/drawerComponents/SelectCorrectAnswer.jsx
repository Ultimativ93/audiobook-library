import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';

import { updateNodeProperty } from '../../../tasks/drawerTasks/LayoutDrawerFunctions';

// "SelectCorrectAnswer.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the correct answer of an input node.
// It is a child of "MuAnsFormatQuestions", "MuChoiFormatQuestions", "ReactNodeFormatQuestions" and "TimeNodeFormatQuestions" component.
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
        <div className='select-correct-answer'>
            <h4 style={{ marginTop: '5px' }}>Set Correct Answer</h4>
            <Input
                placeholder='Correct Answer ..'
                value={correctAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
                focusBorderColor='darkButtons'
            />
            {correctAnswer && (
                <Button
                    colorScheme='red'
                    size='sm'
                    onClick={() => handleRemoveAnswer()}
                    focusBorderColor='darkButtons'
                    marginTop='10px;'
                >
                    Remove Answer
                </Button>
            )}
        </div>
    )
};

export default SelectCorrectAnswer;