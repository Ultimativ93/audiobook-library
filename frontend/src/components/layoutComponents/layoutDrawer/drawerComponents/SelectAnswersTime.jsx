import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Flex, Spacer, Select } from '@chakra-ui/react';

import { removeAnswer, updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';

const SelectAnswersTime = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
    const [answers, setAnswers] = useState(nodeData.data.answers);
    const [answerAudios, setAnswerAudios] = useState(nodeData.data.answerAudios || []);
    const [answerBackgroundAudio, setAnswerBackgroundAudio] = useState([]);
    const timeoutRef = useRef(null);
    const audioPaths = FetchAudio(audiobookTitle);
    const audioUsage = useAudioUsage(audioPaths);

    useEffect(() => {
        setAnswers(nodeData.data.answers)
    }, [nodeData])

    const handleAddAnswer = () => {
        const newAnswer = { answer: `Answer ${answers.length + 1}`, time: '' };
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        updateNodeProperty(setNodes, nodeData, 'answers', updatedAnswers);

        setAnswerAudios([...answerAudios, '']);
        setAnswerBackgroundAudio([...answerBackgroundAudio, false]);
    };

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index][field] = value;
        setAnswers(updatedAnswers);
        updateNodeProperty(setNodes, nodeData, 'answers', updatedAnswers);
    };

    const handleRemoveAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);

        const newAnswerAudios = [...answerAudios];
        newAnswerAudios.splice(index, 1);
        setAnswerAudios(newAnswerAudios);

        updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
        updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);

        removeAnswer(setNodes, setEdges, edges, nodeData, index, setAnswers);
    };

    const handleInputChange = (index, value, type) => {
        console.log("wir setzen ein neues Audio: ", value, audioUsage)

        const newAnswers = [...answers];
        const newAnswerAudios = [...answerAudios];

        if (newAnswers[index] === undefined) {
            newAnswers[index] = '';
        }

        if (newAnswerAudios[index] === undefined) {
            newAnswerAudios[index] = '';
        }

        if (value === undefined || value === '') {
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

        if (type === 'answer' && value.trim() === '') {
            newAnswerAudios[index] = '';
            setAnswerAudios(newAnswerAudios);
            updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
        }
    };


    const handleInputBlur = (index, type) => {
        const answerValue = type === 'answer' ? answers[index]?.answer : answerAudios[index];
        if (!answerValue) return;

        const trimmedAnswer = answerValue.trim();
        if (trimmedAnswer === '') {
            handleRemoveAnswer(index);
        }
    };

    const handleToggleBackgroundAudio = (index) => {
        const newAnswerBackgroundAudio = [...answerBackgroundAudio];
        newAnswerBackgroundAudio[index] = !newAnswerBackgroundAudio[index];
        setAnswerBackgroundAudio(newAnswerBackgroundAudio);
    };

    return (
        <>
            <h4 style={{ marginTop: '5px' }}>Timebased Answers</h4>
            {answers.map((answer, index) => (
                <Flex key={index} direction="column" align="start">
                    <Flex align="center">
                        <Input
                            placeholder="Answer .."
                            value={answer.answer || `Answer ${index + 1}`}
                            onChange={(e) => handleAnswerChange(index, 'answer', e.target.value)}
                            flex="5"
                            style={{ marginTop: '5px' }}
                        />
                        <Spacer />
                        <Select
                            placeholder='Answer Audio ..'
                            value={answerAudios[index] || 'Answer'}
                            onChange={(e) => handleInputChange(index, e.target.value, 'answerAudio')}
                            flex="4"
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
                            placeholder="00:01"
                            value={answer.time}
                            onChange={(e) => handleAnswerChange(index, 'time', e.target.value)}
                            flex="2"
                        />
                    </Flex>
                    <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleRemoveAnswer(index)}
                        style={{ marginTop: '5px' }}
                    >
                        Remove Answer
                    </Button>
                </Flex>
            ))}
            <Button colorScheme='blue' size='sm' style={{ marginTop: '5px' }} onClick={handleAddAnswer}>
                Add Answer
            </Button>
        </>
    );
};

export default SelectAnswersTime;
