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
  const audioPaths = FetchAudio(audiobookTitle);
  const audioUsage = useAudioUsage(audioPaths);

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
    console.log("NodeData", nodeData);
    const numAnswerPeriods = nodeData.data.answerPeriods.length;
    const numEdges = edges.length;
    let lastPeriodHasEdge = null;

    console.log("numAnswerPeriods !== numEdges", numAnswerPeriods, numEdges);

    if ((numAnswerPeriods !== numEdges) || (numAnswerPeriods === numEdges)) {
      lastPeriodHasEdge = true;
    }

    const newPeriods = [...periods, { start: '', end: '', answer: `Period ${periods.length + 1}` }];

    updateNodeProperty(setNodes, nodeData, 'answerPeriods', newPeriods);
    setPeriods(newPeriods);

    console.log("lastperiodHasEdge", lastPeriodHasEdge);

    if (lastPeriodHasEdge) {
      const lastHandleId = `${nodeData.id}-handle-${periods.length}`;
      console.log("lastHandleId", lastHandleId);
      const edge = edges.find(edge => edge.sourceHandle === lastHandleId);
      console.log("edge", edge);
      if (edge) {
        const updatedEdges = edges.map(edg => {
          if (edg === edge) {
            return { ...edg, sourceHandle: `${nodeData.id}-handle-${periods.length + 1}` };
          }
          return edg;
        });

        updatedEdges.sort((a, b) => {
          const indexA = parseInt(a.sourceHandle.split('-').pop());
          const indexB = parseInt(b.sourceHandle.split('-').pop());
          return indexA - indexB;
        });

        setEdges(updatedEdges);
      }
    }
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

    const handleIdToRemove = `${nodeData.id}-handle-${index}`;
    const edgeToRemove = edges.find(edge => edge.sourceHandle === handleIdToRemove);

    if (edgeToRemove) {
      const updatedEdges = edges.filter(edg => edg !== edgeToRemove);
      setEdges(updatedEdges);
    }
  };

  const handleRemoveAnswer = (index) => {
    const newAnswerAudios = [...answerAudios];
    newAnswerAudios.splice(index, 1);
    setAnswerAudios(newAnswerAudios);
    updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
  };

  const handleInputBlur = (index, type) => {
    const audio = answerAudios[index];
    if (!audio) return;

    const trimmedAudio = audio.trim();
    if (trimmedAudio === '') {
      handleRemoveAnswer(index);
    }
  };

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
              focusBorderColor='darkButonns'
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
