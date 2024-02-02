import React from 'react';
import { Button } from '@chakra-ui/react';

import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

const PlayerAnswers = ({ currentNodeProps, flow, setCurrentNode }) => {

    const handleButtonClick = (index) => {
        handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
    };

    return (
        <>
            {currentNodeProps && currentNodeProps.answers && currentNodeProps.answers.length > 0 && (
                <div>
                    <p>Question: {currentNodeProps.question}</p>
                    <p>Answers:</p>
                    <ul>
                        {currentNodeProps.answers.map((answer, index) => (
                            <Button colorScheme='blue' style={{ margin: 10 }} key={index} onClick={() => handleButtonClick(index)}>
                                {answer}
                            </Button>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default PlayerAnswers;