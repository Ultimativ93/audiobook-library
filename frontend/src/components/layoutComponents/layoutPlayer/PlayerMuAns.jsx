import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';

import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

const PlayerMuAns = ({ currentNodeProps, flow, setCurrentNode }) => {
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [clickedAnswers, setClickedAnswers] = useState([]);

    const handleButtonClick = (answer) => {
        if (!selectedAnswers.includes(answer)) {
            setSelectedAnswers((prevAnswers) => [...prevAnswers, answer]);
            setClickedAnswers((prevClickedAnswers) => [...prevClickedAnswers, answer]);
        } else {
            setSelectedAnswers((prevAnswers) => prevAnswers.filter((prevAnswer) => prevAnswer !== answer));
            setClickedAnswers((prevClickedAnswers) => prevClickedAnswers.filter((prevAnswer) => prevAnswer !== answer));
        }
    };

    const handleSubmitCombination = () => {
        if (currentNodeProps && currentNodeProps.answerCombinations && currentNodeProps.answerCombinations.length > 0) {
          const selectedAnswersString = selectedAnswers.sort().join(','); // Sortiere und konvertiere die ausgewählten Antworten zu einem String
      
          const matchingCombinationIndex = currentNodeProps.answerCombinations.findIndex((combination) => {
            const combinationAnswersString = combination.answers.sort().join(',');
            return selectedAnswersString === combinationAnswersString;
          });
      
          if (matchingCombinationIndex !== -1) {
            // Führe handleButtonClickLogic mit dem gefundenen Index aus
            handleButtonClickLogic(matchingCombinationIndex, flow, currentNodeProps, setCurrentNode);
          } else {
            alert('This combination doest work! Bad!');
          }
        } else {
          alert('No Combinations found! Bad!.');
        }
      };
      
    return (
        <>
            {currentNodeProps && currentNodeProps.answers && currentNodeProps.answers.length > 0 && (
                <div>
                    <p>Question: {currentNodeProps.question}</p>
                    <p>Answers: </p>
                    <ul>
                        {currentNodeProps.answers.map((answer, index) => (
                            <Button
                                colorScheme={clickedAnswers.includes(answer) ? 'orange' : 'blue'}
                                style={{ margin: 10 }}
                                key={index}
                                onClick={() => handleButtonClick(answer)}
                            >
                                {answer}
                            </Button>
                        ))}
                    </ul>

                    <Button colorScheme='green' onClick={handleSubmitCombination}>
                        Submit Combination
                    </Button>
                </div>
            )}
        </>
    );
};

export default PlayerMuAns;
