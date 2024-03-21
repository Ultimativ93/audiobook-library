import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Flex, Select, Spacer } from '@chakra-ui/react';

import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';

const SelectAnswers = ({ nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
  const [answers, setAnswers] = useState(nodeData.data.answers || []);
  const [answerAudios, setAnswerAudios] = useState(nodeData.data.answerAudios || []);
  const [answerBackgroundAudio, setAnswerBackgroundAudio] = useState([]);
  const timeoutRef = useRef(null);
  const [audioPaths, setAudioPaths] = useState([]);
  const audioUsage = useAudioUsage(audioPaths);

  useEffect(() => {
    const fetchAudioPaths = async () => {
      const paths = await FetchAudio(audiobookTitle);
      setAudioPaths(paths);
      setFileChange(false);
    };

    fetchAudioPaths();
  }, [audiobookTitle, nodeData, fileChange]);

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
      const newAnswer = `Insert Answer ${answers.length + 1}`;
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      setAnswerAudios([...answerAudios, '']);
      setAnswerBackgroundAudio([...answerBackgroundAudio, false]);
      updateNodeProperty(setNodes, nodeData, 'answers', updatedAnswers);
      updateNodeProperty(setNodes, nodeData, 'answerAudios', [...answerAudios, '']);
    }
  };

  const handleInputChange = (index, value, type) => {
    const newAnswers = [...answers];
    const newAnswerAudios = [...answerAudios];

    if (type === 'answer') {
      newAnswers[index] = value;
    } else if (type === 'answerAudio') {
      newAnswerAudios[index] = value;
      updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
    }

    setAnswers(newAnswers);
    setAnswerAudios(newAnswerAudios);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim() === '') {

    } else {
      timeoutRef.current = setTimeout(() => {
        updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
      }, 500);
    }
  };

  const handleRemoveAnswer = (index) => {
    if (nodeData.type !== 'muAns') {
      const newAnswers = [...answers];
      const newAnswerAudios = [...answerAudios];
      const newAnswerBackgroundAudio = [...nodeData.data.backgroundAudio];
      console.log("newAnswerBackgroundAudio", newAnswerBackgroundAudio);

      const deletedBackgroundAudio = newAnswerBackgroundAudio[index];
      console.log("deletedBackgroundAudio", deletedBackgroundAudio);

      newAnswers.splice(index, 1);
      newAnswerAudios.splice(index, 1);

      if (deletedBackgroundAudio && deletedBackgroundAudio.audio.includes('answer-')) {
        newAnswerBackgroundAudio.splice(index, 1);
        console.log("newAnswerBackgroundAudio", newAnswerBackgroundAudio);

        for (let i = index; i < newAnswerBackgroundAudio.length; i++) {
          if (newAnswerBackgroundAudio[i] && newAnswerBackgroundAudio[i].audio.includes('answer-')) {
            const parts = newAnswerBackgroundAudio[i].audio.split('-');
            parts[1] = (parseInt(parts[1]) - 1).toString();
            newAnswerBackgroundAudio[i].audio = parts.join('-');
          }
        }
      }

      const removedHandleId = `${nodeData.id}-handle-${index}`;
      const newEdges = edges.filter(edge => {
        if (edge.sourceHandle === removedHandleId) {
          return false;
        } else if (edge.sourceHandle && edge.sourceHandle.includes('-handle-')) {
          const handleIndex = parseInt(edge.sourceHandle.split('-').pop());
          if (handleIndex > index) {
            edge.sourceHandle = `${nodeData.id}-handle-${handleIndex - 1}`;
          }
        }
        return true;
      });

      setAnswers(newAnswers);
      setAnswerAudios(newAnswerAudios);
      setEdges(newEdges);

      updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
      updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
      updateNodeProperty(setNodes, nodeData, 'backgroundAudio', newAnswerBackgroundAudio);
    } else if (nodeData.type === 'muAns') {
      const removedAnswer = answers[index];
      const updatedAnswers = answers.filter(answer => answer !== removedAnswer);
      const updatedAnswerAudios = answerAudios.filter((audio, i) => i !== index);
      const updatedAnswerBackgroundAudio = [...nodeData.data.backgroundAudio]

      let updatedCombinations = [];

      if (nodeData.data.answerCombinations) {
        updatedCombinations = nodeData.data.answerCombinations.filter(combination => {
          return !combination.answers.includes(removedAnswer);
        });
      }

      let removedHandles = [];

      if (nodeData.data.answerCombinations.length > 0) {
        removedHandles = nodeData.data.answerCombinations.flatMap((combination, idx) => {
          if (combination.answers.includes(removedAnswer)) {
            console.log("Combination with Removed Answer at Index", idx);
            return `${nodeData.id}-handle-${idx}`;
          }
          return [];
        });

        console.log("Indexes of Combinations with Removed Answer:", removedHandles);
      }

      const newEdges = edges.filter(edge => !removedHandles.includes(edge.sourceHandle));

      setEdges(newEdges);

      const handleIndices = newEdges.map(edge => {
        if (edge.sourceHandle !== null) {
          return parseInt(edge.sourceHandle.split('-').pop());
        }
        return null;
      }).filter(idx => idx !== null);

      const minIndex = Math.min(...handleIndices);
      if (minIndex !== 0) {
        newEdges.forEach(edge => {
          if (edge.sourceHandle !== null) {
            const currentIndex = parseInt(edge.sourceHandle.split('-').pop());
            const newIndex = currentIndex - minIndex;
            edge.sourceHandle = `${nodeData.id}-handle-${newIndex}`;
          }
        });

        setEdges(newEdges);
      }

      updatedAnswerBackgroundAudio.splice(index, 1);

      updatedAnswerBackgroundAudio.forEach(audio => {
        if (audio.audio.includes('answer-')) {
          const parts = audio.audio.split('-');
          const audioIndex = parseInt(parts[1]);
          if (audioIndex > index) {
            parts[1] = (audioIndex - 1).toString();
            audio.audio = parts.join('-');
          }
        }
      });

      setAnswers(updatedAnswers);
      setAnswerAudios(updatedAnswerAudios);
      setAnswerBackgroundAudio(updatedAnswerBackgroundAudio);

      updateNodeProperty(setNodes, nodeData, 'answers', updatedAnswers);
      updateNodeProperty(setNodes, nodeData, 'answerAudios', updatedAnswerAudios);
      updateNodeProperty(setNodes, nodeData, 'backgroundAudio', updatedAnswerBackgroundAudio)
      updateNodeProperty(setNodes, nodeData, 'answerCombinations', updatedCombinations);
    }
  }

  const handleToggleBackgroundAudio = (index) => {
    const newAnswerBackgroundAudio = [...answerBackgroundAudio];
    newAnswerBackgroundAudio[index] = !newAnswerBackgroundAudio[index];
    setAnswerBackgroundAudio(newAnswerBackgroundAudio);
  };

  // Filter audioPaths for 'answer' and 'universal' categories
  const filteredAudioPaths = audioPaths.filter(audio => audio.audioCategory === 'answer' || audio.audioCategory === 'universal');

  return (
    <div className='select-answer-container'>
      <h4>Answers</h4>
      {answers.map((answer, index) => (
        <Flex key={index} alignItems="center">
          <Input
            placeholder='Answer .. '
            value={answer}
            onChange={(e) => handleInputChange(index, e.target.value, 'answer')}
            focusBorderColor='darkButtons'
            flex="5"
          />
          <Spacer />
          <Select
            key={answerAudios[index] || ''}
            placeholder='Answer Audio ..'
            value={answerAudios[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value, 'answerAudio')}
            focusBorderColor='darkButtons'
            flex="5"
          >
            {filteredAudioPaths.map((audio, idx) => {
              const color = audioUsage[audio.audioName] ? '#C6F6D5' : 'inherit';
              return (
                <option
                  key={idx}
                  value={audio.audioName}
                  style={{ backgroundColor: color }}
                >
                  {audio.audioName}
                  {audioUsage[audio.audioName] ? <span style={{ color: 'green', marginLeft: '10px' }}> ✓</span> : null}
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
            fileChange={fileChange}
            setFileChange={setFileChange}
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
      <Button colorScheme='darkButtons' size='sm' onClick={handleAddAnswer}>
        Add Answer
      </Button>
    </div>
  );
};

export default SelectAnswers;
