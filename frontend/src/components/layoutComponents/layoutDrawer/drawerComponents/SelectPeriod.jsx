import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Flex, Spacer, Select } from '@chakra-ui/react';

import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';

const SelectPeriod = ({ nodeData, setNodes, audiobookTitle }) => {
  const [periods, setPeriods] = useState(nodeData.data.answerPeriods);
  const [answerAudios, setAnswerAudios] = useState(nodeData.data.answerAudios || []);
  const timeoutRef = useRef(null);
  const audioPaths = FetchAudio(audiobookTitle);
  const audioUsage = useAudioUsage(audioPaths);

  useEffect(() => {
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

  const handleInputChange = (index, value, type) => {
    const newAnswerAudios = [...answerAudios];

    if (newAnswerAudios[index] === undefined) {
      newAnswerAudios[index] = '';
    }

    if (type === 'answerAudio') {
      newAnswerAudios[index] = value;
    }

    setAnswerAudios(newAnswerAudios);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim() === '') {
      handleInputBlur(index, type);
    } else {
      timeoutRef.current = setTimeout(() => {
        updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
      }, 500);
    }
  };

  const handleAddPeriod = () => {
    setPeriods([...periods, { start: '', end: '' }]);
  };

  const handlePeriodChange = (index, field, value) => {
    const updatedPeriods = [...periods];
    updatedPeriods[index][field] = value;
    setPeriods(updatedPeriods);
    updateNodeProperty(setNodes, nodeData, 'answerPeriods', updatedPeriods);
  };

  const handleRemovePeriod = (index) => {
    const newPeriods = [...periods];
    newPeriods.splice(index, 1);
    setPeriods(newPeriods);
    updateNodeProperty(setNodes, nodeData, 'answerPeriods', newPeriods);
  };

  const handleRemoveAnswer = (index) => {
    const newAnswerAudios = [...answerAudios];
    newAnswerAudios.splice(index, 1);
    setAnswerAudios(newAnswerAudios);
    updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
  };

  const handleInputBlur = (index, type) => {
    const trimmedAnswer = answerAudios[index].trim();
    if (trimmedAnswer === '') {
      handleRemoveAnswer(index);
    }
  };

  return (
    <>
      <h4>Period Based Reactions</h4>
      {periods.map((period, index) => (
        <Flex key={index} direction="column" align="start">
          <Flex align="center">
            <Input
              placeholder='Answer ..'
              value={period.answer}
              onChange={(e) => handlePeriodChange(index, 'answer', e.target.value)}
              flex="5"
            />
            <Spacer />
            <Select
              placeholder='Answer Audio ..'
              value={answerAudios[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value, 'answerAudio')}
              onBlur={() => handleInputBlur(index, 'answerAudio')}
              flex="7"
            >
              {audioPaths.map((audio, idx) => {
                const color = audioUsage[audio.audioName] ? 'green' : 'orange';
                return (
                  <option
                    key={idx}
                    value={audio.audioName}
                    style={{ color: color }}
                  >
                    {audio.audioName}
                  </option>
                )

              })}


            </Select>
            <Spacer />
            <Input
              placeholder='00:00'
              value={period.start}
              onChange={(e) => handlePeriodChange(index, 'start', e.target.value)}
              flex="5"
            />
            <Spacer />
            <Input
              placeholder='00:00'
              value={period.end}
              onChange={(e) => handlePeriodChange(index, 'end', e.target.value)}
              flex="5"
            />
          </Flex>
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => handleRemovePeriod(index)}
          >
            Remove Period
          </Button>
        </Flex>
      ))}
      <Button colorScheme="blue" size="sm" onClick={handleAddPeriod}>
        Add Period
      </Button>
    </>
  );
};

export default SelectPeriod;
