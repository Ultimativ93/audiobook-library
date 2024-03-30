import React from 'react';
import { Button, Input } from '@chakra-ui/react';

import '../playerInput/player-input.css'
import "../../../../views/player/player.css";
import { handleButtonClickLogic } from '../../../tasks/playerTasks/PlayerLogic';

// "PlayerInput.jsx" component, is accessed by the "Player" component in the "LayoutMenuModalPreview" and the "Audiobook" view.
// It handles the Input Node in the player, showcases an input field handles the answer, wrong answer or no answer.
// It is a child of "Player" component.
const PlayerInput = ({ currentNodeProps, flow, setCurrentNode, visible }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        if (currentNodeProps.correctAnswer === event.target.elements.answer.value) {
            handleButtonClickLogic(1, flow, currentNodeProps, setCurrentNode);
        } else {
            handleButtonClickLogic(0, flow, currentNodeProps, setCurrentNode);
        }
    }

    const handleButtonNoAnswer = () => {
        handleButtonClickLogic(2, flow, currentNodeProps, setCurrentNode);
    }

    return (
        <>
            {visible && (
                <div>
                    <p className='question'>Question: {currentNodeProps.question}</p>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <Input
                            name='answer'
                            placeholder='Type correct answer'
                            style={{ width: '300px', backgroundColor: 'white' }}
                            focusBorderColor='darkButtons'
                        />
                        <div className='player-input-buttons'>
                            <Button type='submit' colorScheme='highlightColor'>Submit Answer</Button>
                            <Button colorScheme='darkButtons' onClick={handleButtonNoAnswer}>I dont know the answer</Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}

export default PlayerInput;