import React from 'react';
import { Button } from '@chakra-ui/react';

import '../../../views/player/player.css';

import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

// "PlayerAnswers.jsx" component, is accessed by the "Player" component in the "LayoutMenuModalPreview" and the "Audiobook" view.
// It shows the answer of the current node in the player.
// It is a child of "Player" component.
const PlayerAnswers = ({ currentNodeProps, flow, setCurrentNode, visible }) => {
    const handleButtonClick = (index) => {
        handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
    };

    return (
        <>
            {visible && currentNodeProps && currentNodeProps.answers && currentNodeProps.answers.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p className='question'>Question: {currentNodeProps.question}</p>
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
