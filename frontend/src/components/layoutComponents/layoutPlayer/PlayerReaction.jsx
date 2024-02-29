import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';

import "../../../views/player/player.css";
import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

const PlayerReaction = ({ currentNodeProps, flow, setCurrentNode, onTimeUpdate, questionAudioPlayed, answerProcessAudioPlaying, onValidPeriodChange, visible }) => {
    const [currentTime, setCurrentTime] = useState(null);
    const [validPeriod, setValidPeriod] = useState(null);

    useEffect(() => {
        setCurrentTime(onTimeUpdate);
    }, [onTimeUpdate]);

    const isInValidPeriod = () => {
        if (currentNodeProps && currentNodeProps.answerPeriods && questionAudioPlayed && answerProcessAudioPlaying) {
            for (const period of currentNodeProps.answerPeriods) {
                const start = parseTimeToSeconds(period.start);
                const end = parseTimeToSeconds(period.end);
                if (currentTime >= start && currentTime <= end) {
                    return period;
                }
            }
        }
        return null;
    };

    const parseTimeToSeconds = (timeString) => {
        const [minutes, seconds] = timeString.split(':');
        return parseInt(minutes) * 60 + parseInt(seconds);
    };

    useEffect(() => {
        const period = isInValidPeriod();
        setValidPeriod(period);
        if (onValidPeriodChange) {
            onValidPeriodChange(period !== null);
        }
    }, [currentTime]);

    const handleButtonClick = (index) => {
        handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
    };

    if (questionAudioPlayed) {
        return (
            <>
                {visible && currentNodeProps.question  && (
                    <p className="question">Question: {currentNodeProps.question}</p>
                )}
                {validPeriod && answerProcessAudioPlaying && (
                    <Button
                        onClick={() => handleButtonClick(currentNodeProps.answerPeriods.indexOf(validPeriod))}
                        colorScheme='blue'
                    >
                        {validPeriod.answer}
                    </Button>
                )}
            </>
        );
    } else {
        return null;
    }
};

export default PlayerReaction;
