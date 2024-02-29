import React from 'react';
import { Button, Input } from '@chakra-ui/react';

import '../playerInput/player-input.css'
import "../../../../views/player/player.css";
import { handleButtonClickLogic } from '../../../tasks/playerTasks/PlayerLogic';

const PlayerInput = ({ currentNodeProps, flow, setCurrentNode, visible }) => {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("unser value:", event.target.elements.answer.value);
        console.log("CurrentNode CorrectAnswer", currentNodeProps.correctAnswer);
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
                    <p className="question">Question: {currentNodeProps.question}</p>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <Input
                            name="answer"
                            placeholder='Type correct answer'
                            style={{ width: '300px', backgroundColor: 'white' }}
                        />
                        <div className="player-input-buttons">
                            <Button type="submit" colorScheme='blue'>Submit Answer</Button>
                            <Button colorScheme='red' onClick={handleButtonNoAnswer}>I dont know the answer</Button>
                        </div>
                    </form>
                </div>
            )}

        </>
    )
}

export default PlayerInput;