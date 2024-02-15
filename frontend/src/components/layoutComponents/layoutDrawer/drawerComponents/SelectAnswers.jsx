import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Flex, Select, Spacer } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';

const SelectAnswers = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
  const [answers, setAnswers] = useState(nodeData.data.answers || []);
  const [answerAudios, setAnswerAudios] = useState(nodeData.data.answerAudios || []);
  const timeoutRef = useRef(null);
  const audioPaths = FetchAudio(audiobookTitle);

  useEffect(() => {
    if (!arraysEqual(answers, nodeData.data.answers || [])) {
      setAnswers(nodeData.data.answers || []);
    }
    if (!arraysEqual(answerAudios, nodeData.data.answerAudios || [])) {
      setAnswerAudios(nodeData.data.answerAudios || []);
    }
  }, [nodeData.data.answers, nodeData.data.answerAudios]);

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
      setAnswerAudios([...answerAudios, '']);
    }
  };

  const handleInputChange = (index, value, type) => {
    const newAnswers = [...answers];
    const newAnswerAudios = [...answerAudios];

    if (newAnswers[index] === undefined) {
      newAnswers[index] = '';
    }
    if (newAnswerAudios[index] === undefined) {
      newAnswerAudios[index] = '';
    }

    if (type === 'answer') {
      newAnswers[index] = value;
    } else if (type === 'answerAudio') {
      newAnswerAudios[index] = value;
    }

    setAnswers(newAnswers);
    setAnswerAudios(newAnswerAudios);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim() === '') {
      handleInputBlur(index, type);
    } else {
      timeoutRef.current = setTimeout(() => {
        updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
        updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
      }, 500);
    }
  };

  const handleRemoveAnswer = (index) => {
    const newAnswers = [...answers];
    const newAnswerAudios = [...answerAudios];

    newAnswers.splice(index, 1);
    newAnswerAudios.splice(index, 1);

    setAnswers(newAnswers);
    setAnswerAudios(newAnswerAudios);

    updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
    updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
  };

  const handleInputBlur = (index, type) => {
    const trimmedAnswer = type === 'answer' ? answers[index].trim() : answerAudios[index].trim();
    if (trimmedAnswer === '') {
      handleRemoveAnswer(index);
    }
  };

  return (
    <>
      <h4>Answers</h4>
      {answers.map((answer, index) => (
        <Flex key={index} alignItems="center">
          <Input
            placeholder='Answer .. '
            value={answer}
            onChange={(e) => handleInputChange(index, e.target.value, 'answer')}
            onBlur={() => handleInputBlur(index, 'answer')}
            flex="5"
          />
          <Spacer />
          <Select
            placeholder='Answer Audio ..'
            value={answerAudios[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value, 'answerAudio')}
            onBlur={() => handleInputBlur(index, 'answerAudio')}
            flex="5"
          >
            {audioPaths.map((audio, idx) => (
              <option key={idx} value={audio.audioName}>
                {audio.audioName}
              </option>
            ))}
          </Select>
          <Spacer />
          <Button
            colorScheme='red'
            size='sm'
            onClick={() => handleRemoveAnswer(index)}
          >
            Remove Answer
          </Button>
        </Flex>
      ))}
      <Button colorScheme='blue' size='sm' onClick={handleAddAnswer}>
        Add Answer
      </Button>
    </>
  );
};

export default SelectAnswers;