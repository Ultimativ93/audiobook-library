import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';

import "../../../views/player/player.css";

import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

const PlayerMuAns = ({ currentNodeProps, flow, setCurrentNode, visible }) => {
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
          const selectedAnswersString = selectedAnswers.sort().join(',');
      
          const matchingCombinationIndex = currentNodeProps.answerCombinations.findIndex((combination) => {
            const combinationAnswersString = combination.answers.sort().join(',');
            return selectedAnswersString === combinationAnswersString;
          });
      
          if (matchingCombinationIndex !== -1) {
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
            {visible && currentNodeProps && currentNodeProps.answers && currentNodeProps.answers.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p className="question">Question: {currentNodeProps.question}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {currentNodeProps.answers.map((answer, index) => (
                            <Button
                                key={index}
                                colorScheme={clickedAnswers.includes(answer) ? 'darkButtons' : 'highlightColor'}
                                onClick={() => handleButtonClick(answer)}
                                style={{ margin: '10px' }}
                            >
                                {answer}
                            </Button>
                        ))}
                    </div>
                    <Button colorScheme='highlightColor' onClick={handleSubmitCombination}>
                        Submit Combination
                    </Button>
                </div>
            )}
        </>
    );
};

export default PlayerMuAns;
