import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectAnswers = ({ nodeData, setNodes }) => {
    const [answers, setAnswers] = useState(nodeData.data.answers);
  
    const handleAddAnswer = () => {
      const lastAnswer = answers[answers.length - 1];
      if (lastAnswer !== '') {
        setAnswers([...answers, '']);
      }
      
    };

    const handleInputChange = (index, value) => {
        const newAnswers = [...answers];
        if (newAnswers[index] === undefined) {
          newAnswers[index] = '';
        } 
        newAnswers[index] = value;
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
            defaultValue={answer}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
        <Button colorScheme='blue' size='sm' onClick={handleAddAnswer}>Add Answer</Button>
      </>
    );
  };

export default SelectAnswers;