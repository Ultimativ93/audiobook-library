import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectAnswers = ({ nodeData, setNodes }) => {
    const [answers, setAnswers] = useState(nodeData.data.answers);
  
    const handleAddAnswer = () => {
      setAnswers([...answers, {id: ''}]);
    };

    const handleInputChange = (index, value) => {
        const newAnswers = [...answers];
        if (newAnswers[index] === undefined) {
          newAnswers[index] = { id: '' };
        } else if (typeof newAnswers[index] === 'string') {
          newAnswers[index] = { id: newAnswers[index] };
        }
        newAnswers[index].id = value;
        setAnswers(newAnswers);
        updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
      };
  
    return (
      <>
        <h4>Antworten</h4>
        {answers.map((answer, index) => (
          <Input
            key={index}
            placeholder='Answer .. '
            defaultValue={answer.id}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
        <Button colorScheme='blue' size='sm' onClick={handleAddAnswer}>Add Answer</Button>
      </>
    );
  };

export default SelectAnswers;