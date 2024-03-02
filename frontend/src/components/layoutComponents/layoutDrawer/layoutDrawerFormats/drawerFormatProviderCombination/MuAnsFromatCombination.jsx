import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { DrawerBody } from '@chakra-ui/react';

import { updateAnswerCombination, removeCombination } from '../../LayoutDrawerFunctions';

const MuAnsFromatCombination = ({ nodeData, setNodes, setEdges, edges }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [answerCombinations, setAnswerCombinations] = useState([]);

    useEffect(() => {
        const initialCombinations = nodeData.data?.answerCombinations || [];
        setAnswerCombinations(initialCombinations);
        setSelectedAnswers([]);
      }, [nodeData.data.answerCombinations, nodeData, setSelectedAnswers]);

    useEffect(() => {
        const initialCombinations = nodeData.data?.answerCombinations || [];
        setAnswerCombinations(initialCombinations);
    }, [nodeData.data.answerCombinations, nodeData]);

    const toggleAnswerSelection = (answer) => {
        if (selectedAnswers.includes(answer)) {
            setSelectedAnswers(selectedAnswers.filter(selectedAnswer => selectedAnswer !== answer));
        } else {
            setSelectedAnswers([...selectedAnswers, answer]);
        }
    };

    const handleSaveCombination = () => {
        const existingCombinations = answerCombinations || [];

        if (selectedAnswers.length === 0) {
            alert('Choose at least one answer to create a combination.');
            return;
        }

        const combinationId = (existingCombinations ? existingCombinations.length : 0) + 1;
        const newCombination = { id: combinationId.toString(), answers: selectedAnswers };

        const isCombinationExist = existingCombinations.some((combination) => (
            combination.answers.length === newCombination.answers.length &&
            combination.answers.every((answer) => newCombination.answers.includes(answer))
        ));

        if (!isCombinationExist) {
            setAnswerCombinations((prevAnswerCombinations) => [
                ...(prevAnswerCombinations || []),
                newCombination,
            ]);
            setSelectedAnswers([]);

            updateAnswerCombination(setNodes, nodeData, newCombination);
        } else {
            alert('Combination already exists.');
        }
    };

    const handleRemoveCombination = (combinationId) => {
        setAnswerCombinations((prevAnswerCombinations) =>
            prevAnswerCombinations.filter((combination) => combination.id !== combinationId)
        );

        removeCombination(setNodes, setEdges, edges, nodeData, combinationId);
    };

    const uniqueCombinations = Array.from(new Set(answerCombinations.map(JSON.stringify))).map(JSON.parse);

    //console.log("nodeData in MuAnsFromatCombination", nodeData);
    return (<>
        <DrawerBody>
            <div>
                <h4>Answer Combinations</h4>
                <div>
                    {nodeData.data?.answers.map((answer, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '10px',
                                margin: '5px',
                                border: '1px solid #ccc',
                                backgroundColor: selectedAnswers.includes(answer) ? 'lightblue' : 'white',
                                cursor: 'pointer',
                                display: 'inline-block',
                                borderRadius: 5,
                            }}
                            onClick={() => toggleAnswerSelection(answer)}
                        >
                            {answer}
                        </div>
                    ))}
                </div>
                <Button colorScheme='blue' onClick={handleSaveCombination}>Save Combination</Button>
                <div>
                    <h4>Saved Combinations:</h4>
                    {uniqueCombinations.length > 0 ? (
                        uniqueCombinations.map((combination, index) => (
                            <div key={index}>
                                <p>ID: {combination.id}</p>
                                <p>Answers: {combination.answers ? combination.answers.join(', ') : 'N/A'}</p>
                                <Button colorScheme='red' onClick={() => handleRemoveCombination(combination.id)}>Remove</Button>
                            </div>
                        ))
                    ) : (
                        <p>No combinations saved.</p>
                    )}
                </div>
            </div>
        </DrawerBody>
    </>
    );
};

export default MuAnsFromatCombination;
