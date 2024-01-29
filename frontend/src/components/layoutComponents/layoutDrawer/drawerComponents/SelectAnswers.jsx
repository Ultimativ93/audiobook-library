import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from '@chakra-ui/react';

import { updateNodeProperty, removeAnswer } from '../LayoutDrawerFunctions';

const SelectAnswers = ({ nodeData, setNodes, setEdges, edges }) => {
  const [answers, setAnswers] = useState(nodeData.data.answers);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Hier wird überprüft, ob sich die Antworten in der nodeData geändert haben
    if (!arraysEqual(answers, nodeData.data.answers)) {
      setAnswers(nodeData.data.answers);
    }
  }, [nodeData.data.answers]);

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

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

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if the content is empty, trigger blur immediately
    if (value.trim() === '') {
      handleInputBlur(index);
    } else {
      // Set a new timeout to trigger update after 500 milliseconds
      timeoutRef.current = setTimeout(() => {
        updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
      }, 500);
    }
  };

  const handleRemoveAnswer = (index) => {
    removeAnswer(setNodes, setEdges, edges, nodeData, index, setAnswers);
  };

  const handleInputBlur = (index) => {
    const trimmedAnswer = answers[index].trim();
    if (trimmedAnswer === '') {
      handleRemoveAnswer(index);
    }
  };

  return (
    <>
      <h4>Answers</h4>
      {answers.map((answer, index) => (
        <div key={index}>
          <Input
            placeholder='Answer .. '
            value={answer}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onBlur={() => handleInputBlur(index)}
          />
          <Button
            colorScheme='red'
            size='sm'
            onClick={() => handleRemoveAnswer(index)}
          >
            Remove Answer
          </Button>
        </div>
      ))}
      <Button colorScheme='blue' size='sm' onClick={handleAddAnswer}>
        Add Answer
      </Button>
    </>
  );
};

export default SelectAnswers;
