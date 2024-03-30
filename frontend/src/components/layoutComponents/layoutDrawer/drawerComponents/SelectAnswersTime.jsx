import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Flex, Spacer, Select } from '@chakra-ui/react';

import { updateNodeProperty, useAudioUsage } from '../../../tasks/drawerTasks/LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';

// "SelectAnswersTime.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the time based answers and is handled in the "DrawerFormatProviderQuestions" component.
// It is a child of "InputNodeFormatQuestion" component.
const SelectAnswersTime = ({ nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
    const [answers, setAnswers] = useState(nodeData.data.answers);
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
        setAnswers(nodeData.data.answers);
    }, [nodeData]);

    const handleAddAnswer = () => {
        const newAnswer = { answer: `Insert Answer ${answers.length + 1}`, time: '' };
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
        const newAnswerAudios = [...answerAudios];
        const newAnswerBackgroundAudio = [...nodeData.data.backgroundAudio];

        newAnswers.splice(index, 1);
        newAnswerAudios.splice(index, 1);
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
        setAnswerBackgroundAudio(newAnswerBackgroundAudio);
        setEdges(newEdges);

        updateNodeProperty(setNodes, nodeData, 'answers', newAnswers);
        updateNodeProperty(setNodes, nodeData, 'answerAudios', newAnswerAudios);
        updateNodeProperty(setNodes, nodeData, 'backgroundAudio', newAnswerBackgroundAudio);
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

    // Filter audioPaths for 'answer' and 'universal' categories
    const filteredAudioPaths = audioPaths.filter(audio => audio.audioCategory === 'answer' || audio.audioCategory === 'universal');

    return (
        <div className='select-answers-time-container'>
            <h4 style={{ marginTop: '5px' }}>Timebased Answers</h4>
            {answers.map((answer, index) => (
                <Flex key={index} direction='column' align='start'>
                    <Flex align='center'>
                        <Input
                            placeholder='Answer ..'
                            value={answer.answer || `Answer ${index + 1}`}
                            onChange={(e) => handleAnswerChange(index, 'answer', e.target.value)}
                            flex='5'
                            style={{ marginTop: '5px' }}
                            focusBorderColor='darkButtons'
                        />
                        <Spacer />
                        <Select
                            placeholder='Answer Audio ..'
                            value={answerAudios[index] || 'Answer'}
                            onChange={(e) => handleInputChange(index, e.target.value, 'answerAudio')}
                            flex='4'
                            focusBorderColor='darkButtons'
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
                        <Input
                            placeholder='00:01'
                            value={answer.time}
                            onChange={(e) => handleAnswerChange(index, 'time', e.target.value)}
                            flex='2'
                            focusBorderColor='darkButtons'
                        />
                    </Flex>
                    <Button
                        colorScheme='red'
                        size='sm'
                        onClick={() => handleRemoveAnswer(index)}
                        style={{ marginTop: '5px' }}
                    >
                        Remove Answer
                    </Button>
                </Flex>
            ))}
            <Button colorScheme='darkButtons' size='sm' style={{ marginTop: '5px' }} onClick={handleAddAnswer}>
                Add Answer
            </Button>
        </div>
    );
};

export default SelectAnswersTime;
