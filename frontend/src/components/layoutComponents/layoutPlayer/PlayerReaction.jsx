import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';

import '../../../views/player/player.css';
import { handleButtonClickLogic } from '../../tasks/playerTasks/PlayerLogic';

// "PlayerReaction.jsx" component, is accessed by the "Player" component in the "LayoutMenuModalPreview" and the "Audiobook" view.
// It shows the question and answer of a Reaction node. The answer will be shown by the time the creator added to the noe properties.
// When no answer is selected during the answer process, the no reaction handle will be used to transfer to the next node.
// It is a child of "Player" component.
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
                    <p className='question'>Question: {currentNodeProps.question}</p>
                )}
                {validPeriod && answerProcessAudioPlaying && (
                    <Button
                        onClick={() => handleButtonClick(currentNodeProps.answerPeriods.indexOf(validPeriod))}
                        colorScheme='highlightColor'
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
