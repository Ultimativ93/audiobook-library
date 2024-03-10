import React from 'react';
import { Button } from '@chakra-ui/react';

import "../../../views/player/player.css";
import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

const PlayerAnswers = ({ currentNodeProps, flow, setCurrentNode, visible }) => {
    const handleButtonClick = (index) => {
        handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
    };

    return (
        <>
            {visible && currentNodeProps && currentNodeProps.answers && currentNodeProps.answers.length > 0 && (
                <div>
                    <p className="question">Question: {currentNodeProps.question}</p>
                    <p>Answers:</p>
                    <ul>
                        {currentNodeProps.answers.map((answer, index) => (
                            <Button colorScheme='highlightColor' style={{ margin: 10 }} key={index} onClick={() => handleButtonClick(index)}>
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
