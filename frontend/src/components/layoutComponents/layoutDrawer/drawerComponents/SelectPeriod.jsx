import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Flex, Spacer, Select } from '@chakra-ui/react';

import './drawer-components.css';

import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';

const SelectPeriod = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
  const [periods, setPeriods] = useState(nodeData.data.answerPeriods);
  const [answerAudios, setAnswerAudios] = useState(nodeData.data.answerAudios || []);
  const [answerBackgroundAudio, setAnswerBackgroundAudio] = useState([]);
  const timeoutRef = useRef(null);
  const [audioPaths, setAudioPaths] = useState([]);
  const audioUsage = useAudioUsage(audioPaths);

  useEffect(() => {
    const fetchAudioPaths = async () => {
      const paths = await FetchAudio(audiobookTitle);
      setAudioPaths(paths);
    };

    fetchAudioPaths();
  }, [audiobookTitle, nodeData]);

  useEffect(() => {
    if (!arraysEqual(answerAudios, nodeData.data.answerAudios || [])) {
      setAnswerAudios(nodeData.data.answerAudios || []);
    }
  }, [nodeData.data.answers, nodeData.data.answerAudios]);

  useEffect(() => {
    setAnswerBackgroundAudio(new Array(periods.length).fill(false));
  }, [periods]);

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  const handleToggleBackgroundAudio = (index) => {
    const newAnswerBackgroundAudio = [...answerBackgroundAudio];
    newAnswerBackgroundAudio[index] = !newAnswerBackgroundAudio[index];
    setAnswerBackgroundAudio(newAnswerBackgroundAudio);
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
    const newPeriods = [...periods, { start: '', end: '', answer: `Insert Period ${periods.length + 1}` }];
    updateNodeProperty(setNodes, nodeData, 'answerPeriods', newPeriods);
    setPeriods(newPeriods);
    setAnswerBackgroundAudio([...answerBackgroundAudio, false]);

    const lastHandleIndex = periods.length;
    const lastHandleId = `${nodeData.id}-handle-${lastHandleIndex}`;
    console.log("lastHandleId", lastHandleId)
    const lastEdge = edges.find(edge => edge.sourceHandle === lastHandleId);
    if (lastEdge) {
        lastEdge.sourceHandle = `${nodeData.id}-handle-${lastHandleIndex + 1}`;
        setEdges([...edges]);
    }
};

  const handlePeriodChange = (index, field, value) => {
    const updatedPeriods = [...periods];
    updatedPeriods[index][field] = value;
    setPeriods(updatedPeriods);
    updateNodeProperty(setNodes, nodeData, 'answerPeriods', updatedPeriods);
  };

  const handleRemovePeriod = (index) => {
    console.log("index", index)
    const newPeriods = [...periods];
    newPeriods.splice(index, 1);
    setPeriods(newPeriods);
    updateNodeProperty(setNodes, nodeData, 'answerPeriods', newPeriods);

    const newAnswerAudios = [...answerAudios];
    newAnswerAudios.splice(index, 1);
    setAnswerAudios(newAnswerAudios);
    updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);

    const newAnswerBackgroundAudio = [...nodeData.data.backgroundAudio];
    newAnswerBackgroundAudio.splice(index, 1);

    newAnswerBackgroundAudio.forEach(audio => {
      if (audio.audio.includes('answer-')) {
        const parts = audio.audio.split('-');
        const audioIndex = parseInt(parts[1]);
        if (audioIndex > index) {
          parts[1] = (audioIndex - 1).toString();
          audio.audio = parts.join('-');
        }
      }
    });

    updateNodeProperty(setNodes, nodeData, 'backgroundAudio', newAnswerBackgroundAudio);
    setAnswerBackgroundAudio(newAnswerBackgroundAudio);
    updateEdgesAfterPeriodRemoval(index);
  };

  const updateEdgesAfterPeriodRemoval = (index) => {
    const removedHandleId = `${nodeData.id}-handle-${index}`;
    console.log("removedHandleId", removedHandleId);
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

    setEdges(newEdges);
  };


  const handleInputBlur = (index, type) => {
    const audio = answerAudios[index];
    if (!audio) return;

    const trimmedAudio = audio.trim();
    if (trimmedAudio === '') {
      handleRemovePeriod(index);
    }
  };

  const filteredAudioPaths = audioPaths.filter(audio => audio.audioCategory === 'answer' || audio.audioCategory === 'universal');

  return (
    <div className='select-period-container'>
      <h4 style={{ marginTop: '5px' }}>Period Based Reactions</h4>
      {periods.map((period, index) => (
        <Flex key={index} direction="column" align="start">
          <Flex align="center">
            <Input
              placeholder={`Period ${index + 1}`}
              value={period.answer}
              onChange={(e) => handlePeriodChange(index, 'answer', e.target.value)}
              focusBorderColor='darkButtons'
              flex="5"
            />
            <Spacer />
            <Select
              placeholder='Answer Audio ..'
              value={answerAudios[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value, 'answerAudio')}
              onBlur={() => handleInputBlur(index, 'answerAudio')}
              focusBorderColor='darkButtons'
              flex="7"
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
            />
            <Spacer />
            <Input
              placeholder='00:00'
              value={period.start}
              onChange={(e) => handlePeriodChange(index, 'start', e.target.value)}
              focusBorderColor='darkButtons'
              flex="5"
            />
            <Spacer />
            <Input
              placeholder='00:00'
              value={period.end}
              onChange={(e) => handlePeriodChange(index, 'end', e.target.value)}
              focusBorderColor='darkButtons'
              flex="5"
            />
          </Flex>
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => handleRemovePeriod(index)}
            className="remove-period-button"
          >
            Remove Period
          </Button>
        </Flex>
      ))}
      <Button
        colorScheme="darkButtons"
        size="sm"
        onClick={handleAddPeriod}
        className="add-period-button"
      >
        Add Period
      </Button>
    </div>
  );
};

export default SelectPeriod;
