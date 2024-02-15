import React, { useState, useRef } from 'react';
import { Button, Input, Flex, Spacer, Select } from '@chakra-ui/react';

import { removeAnswer, updateAnswersAndTimes, updateNodeProperty } from '../LayoutDrawerFunctions';
import FetchAudio from '../../../tasks/editorTasks/FetchAudio';

const SelectAnswersTime = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
    const [answers, setAnswers] = useState(nodeData.data.answers);
    const [answerAudios, setAnswerAudios] = useState(nodeData.data.answerAudios || []);
    const timeoutRef = useRef(null);
    const audioPaths = FetchAudio(audiobookTitle);

    const handleAddAnswer = () => {
        const lastAnswer = answers[answers.length - 1];
        if (lastAnswer && typeof lastAnswer === 'object' && lastAnswer.answer !== '') {
          setAnswers([...answers, { answer: '', time: '' }]);
          setAnswerAudios([...answerAudios, '']);
        }
    };

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index][field] = value;
        setAnswers(updatedAnswers);
        updateAnswersAndTimes(setNodes, nodeData, updatedAnswers);
    };

    const handleRemoveAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);
        removeAnswer(setNodes, setEdges, edges, nodeData, index, setAnswers);
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

    const handleInputBlur = (index, type) => {
        const trimmedAnswer = type === 'answer' ? answers[index].trim() : answerAudios[index].trim();
        if (trimmedAnswer === '') {
            handleRemoveAnswer(index);
        }
    };

    return (
        <>
            <h4>Timebased Answers</h4>
            {answers.map((answer, index) => (
                <Flex key={index} direction="column" align="start">
                    <Flex align="center">
                        <Input
                            placeholder="Answer .."
                            value={answer.answer}
                            onChange={(e) => handleAnswerChange(index, 'answer', e.target.value)}
                            flex="5"
                        />
                        <Spacer />
                        <Select
                            placeholder='Answer Audio ..'
                            value={answerAudios[index] || ''}
                            onChange={(e) => handleInputChange(index, e.target.value, 'answerAudio')}
                            onBlur={() => handleInputBlur(index, 'answerAudio')}
                            flex="4"
                        >
                            {audioPaths.map((audio, idx) => (
                                <option key={idx} value={audio.audioName}>
                                    {audio.audioName}
                                </option>
                            ))}
                        </Select>
                        <Spacer />
                        <Input
                            placeholder="00:00"
                            value={answer.time}
                            onChange={(e) => handleAnswerChange(index, 'time', e.target.value)}
                            flex="2"
                        />
                    </Flex>
                    <Button
                        colorScheme="red"
                        size="sm"
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

export default SelectAnswersTime;
