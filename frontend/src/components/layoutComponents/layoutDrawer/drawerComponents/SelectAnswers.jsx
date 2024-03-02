import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Flex, Select, Spacer } from '@chakra-ui/react';

import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';

const SelectAnswers = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
  const [answers, setAnswers] = useState(nodeData.data.answers || []);
  const [answerAudios, setAnswerAudios] = useState(nodeData.data.answerAudios || []);
  const [answerBackgroundAudio, setAnswerBackgroundAudio] = useState([]);
  const timeoutRef = useRef(null);
  const audioPaths = FetchAudio(audiobookTitle);
  const audioUsage = useAudioUsage(audioPaths);

  useEffect(() => {
    if (!arraysEqual(answers, nodeData.data.answers || [])) {
      setAnswers(nodeData.data.answers || []);
    }
    if (!arraysEqual(answerAudios, nodeData.data.answerAudios || [])) {
      setAnswerAudios(nodeData.data.answerAudios || []);
    }
  }, [nodeData.data.answers, nodeData.data.answerAudios]);

  useEffect(() => {
    setAnswerBackgroundAudio(new Array(answers.length).fill(false));
  }, [answers]);

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
      const newAnswer = `Answer ${answers.length + 1}`;
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      setAnswerAudios([...answerAudios, '']);
      setAnswerBackgroundAudio([...answerBackgroundAudio, false]);
      updateNodeProperty(setNodes, nodeData, 'answers', updatedAnswers);
    }
  };

  const handleInputChange = (index, value, type) => {
    const newAnswers = [...answers];
    const newAnswerAudios = [...answerAudios];
    const newAnswerBackgroundAudio = [...answerBackgroundAudio];

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
    const newAnswerBackgroundAudio = [...answerBackgroundAudio];

    newAnswers.splice(index, 1);
    newAnswerAudios.splice(index, 1);
    newAnswerBackgroundAudio.splice(index, 1);

    const newEdges = edges.filter(edge => {
      const sourceHandleId = `${nodeData.id}-handle-${index}`;
      return edge.sourceHandle !== sourceHandleId;
    });

    setAnswers(newAnswers);
    setAnswerAudios(newAnswerAudios);
    setAnswerBackgroundAudio(newAnswerBackgroundAudio);
    setEdges(newEdges);

    updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
    updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
  };


  const handleInputBlur = (index, type) => {
    if (type === 'answer') {
      const trimmedAnswer = (answers[index] || '').trim();
      if (trimmedAnswer === '') {
        handleRemoveAnswer(index);
      }
    }
  };

  const handleToggleBackgroundAudio = (index) => {
    const newAnswerBackgroundAudio = [...answerBackgroundAudio];
    newAnswerBackgroundAudio[index] = !newAnswerBackgroundAudio[index];

    setAnswerBackgroundAudio(newAnswerBackgroundAudio);
  };

  //console.log("nodeData in SelectAnswers:", nodeData);
  //console.log("nodeData answers", nodeData.data.answers)
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
          <SwitchBackgroundAudio
            backgroundAudioFor={`answer-${index}`}
            nodeData={nodeData}
            setNodes={setNodes}
            audiobookTitle={audiobookTitle}
            isChecked={answerBackgroundAudio[index]}
            onToggle={() => handleToggleBackgroundAudio(index)}
          />
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