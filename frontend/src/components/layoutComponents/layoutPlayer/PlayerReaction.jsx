import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';

import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

const PlayerReaction = ({ currentNodeProps, flow, setCurrentNode, onTimeUpdate, questionAudioPlayed }) => {
    const [currentTime, setCurrenTime] = useState(null);

    useEffect(() => {
        setCurrenTime(onTimeUpdate);
    }, [onTimeUpdate]);

    const isInValidPeriod = () => {
        if (currentNodeProps && currentNodeProps.answerPeriods) {
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

    const validPeriod = isInValidPeriod();

    const handleButtonClick = (index) => {
        handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
    };

    if (questionAudioPlayed && currentTime !== null && currentTime !== undefined && currentTime !== 0 && validPeriod) {
        return (
            <>
                {currentNodeProps.question}
                <Button
                    onClick={() => handleButtonClick(currentNodeProps.answerPeriods.indexOf(validPeriod))}
                    colorScheme='blue'
                >
                    {validPeriod.answer}

                </Button>
            </>
        );
    }

    return (
        <>
            {currentNodeProps && currentNodeProps.question}
        </>
    );
};

export default PlayerReaction;
