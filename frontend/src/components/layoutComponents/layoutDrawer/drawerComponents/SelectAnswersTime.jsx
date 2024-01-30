import React, { useState } from 'react';
import { Button, Input, Flex, Spacer } from '@chakra-ui/react';
import { removeAnswer, updateAnswersAndTimes } from '../LayoutDrawerFunctions';

const SelectAnswersTime = ({ nodeData, setNodes, setEdges, edges }) => {
    const [answers, setAnswers] = useState(nodeData.data.answers);

    const handleAddAnswer = () => {
        const lastAnswer = answers[answers.length - 1];
        if (lastAnswer.answer !== '' && lastAnswer.time !== '') {
            setAnswers([...answers, { answer: '', time: '' }]);
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
                            flex="8"
                        />
                        <Spacer />
                        <Input
                            placeholder="Time .."
                            value={answer.time}
                            onChange={(e) => handleAnswerChange(index, 'time', e.target.value)}
                            flex="4"
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
            <Button colorScheme="blue" size="sm" onClick={handleAddAnswer}>
                Add Answer
            </Button>
        </>
    );
};

export default SelectAnswersTime;
