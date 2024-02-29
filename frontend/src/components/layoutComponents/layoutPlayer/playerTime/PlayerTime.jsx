import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import { handleButtonClickLogic } from '../../../tasks/playerTasks/PlayerLogic';

import '../playerTime/player-time.css';
import '../../../../views/player/player.css'

const PlayerTime = ({ currentNodeProps, flow, setCurrentNode, onTimeUpdate, visible, answerProcessAudioPlaying }) => {
    const [currentTime, setCurrentTime] = useState(null);

    useEffect(() => {
        setCurrentTime(onTimeUpdate);
    }, [onTimeUpdate]);

    const handleButtonClick = (index) => {
        handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
    };

    const renderAnswers = () => {
        if (currentNodeProps && currentNodeProps.answers && answerProcessAudioPlaying) {
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
            {visible && currentNodeProps.question  && (
                <p className="question">Question: {currentNodeProps.question}</p>
            )}
            <div className='player-time'>
                {visible && renderAnswers()}
            </div>
        </>

    );
};

export default PlayerTime;
