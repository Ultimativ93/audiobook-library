import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import { handleButtonClickLogic } from '../../../tasks/playerTasks/PlayerLogic';

import '../playerTime/player-time.css';

const PlayerTime = ({ currentNodeProps, flow, setCurrentNode, onTimeUpdate }) => {
    const [currentTime, setCurrentTime] = useState(null);

    useEffect(() => {
        setCurrentTime(onTimeUpdate);
    }, [onTimeUpdate]);

    console.log("CurrentNodeProps in PT: ", currentNodeProps);

    const handleButtonClick = (index) => {
        handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
    };

    const renderAnswers = () => {
        if (currentNodeProps && currentNodeProps.answers) {
            return currentNodeProps.answers.map((answer, index) => {
                const answerTime = parseTimeToSeconds(answer.time);
                const shouldDisplay = currentTime <= answerTime;

                return (
                    <div key={index} style={{ display: shouldDisplay ? 'block' : 'none' }}>
                        <Button
                            onClick={() => handleButtonClick(currentNodeProps.answers.indexOf(answer))}
                            colorScheme='blue'
                        >
                            {answer.answer}
                        </Button>
                    </div>
                );
            });
        }
        return null;
    };

    const parseTimeToSeconds = (timeString) => {
        if (timeString && typeof timeString === 'string') {
            const [minutes, seconds] = timeString.split(':');
            return parseInt(minutes) * 60 + parseInt(seconds);
        }
        return 0;
    };

    return (
        <>
            {currentNodeProps.question}
            <div className='player-time'>
                {renderAnswers()}
            </div>
        </>

    );
};

export default PlayerTime;
