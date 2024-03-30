import React, { useEffect, useState } from 'react';

import './drawer-components.css';

import { getAudioPathFromName, getAudioFromPath, getCurrentAudioLength } from '../../../tasks/playerTasks/PlayerLogic';
import { updateNodeProperty } from '../../../tasks/drawerTasks/LayoutDrawerFunctions';

// "ShowAudioLength.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the length of an audio and returns a div with the audio length.
// It is a child of "ReactNodeFormatQuestions", "TimeNodeFormatQuestion" component.
const ShowAudioLength = ({ nodeData, setNodes, audioName, audiobookTitle }) => {
    const [audioLength, setAudioLength] = useState();

    const fetchData = async () => {
        const audioPath = await getAudioPathFromName(audioName, audiobookTitle);
        const audioBlob = await getAudioFromPath(audioPath);
        console.log('audioBlob in here', audioBlob)
        const newAudioLength = await getCurrentAudioLength(audioBlob);
        console.log('newAudioLength', newAudioLength)
        if (newAudioLength !== null) {
            convertToTime(newAudioLength);
        }
    }

    useEffect(() => {
        fetchData();
    }, [audioName])

    useEffect(() => {
        if (audioLength) {
            updateNodeProperty(setNodes, nodeData, 'answerProcessAudioLength', audioLength);
        }
    }, [audioLength])

    const convertToTime = (newAudioLength) => {
        const minutes = Math.floor(newAudioLength / 60);
        const remainingSeconds = Math.floor(newAudioLength % 60);
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formatedSeconds = remainingSeconds.toString().padStart(2, '0');
        const formatedAudioLength = formattedMinutes + ':' + formatedSeconds;
        setAudioLength(formatedAudioLength);
    }

    return (
        <div className='show-audio-length'>
            <h4>Audio Length:</h4>
            <p>{audioLength}</p>
        </div>
    )
}

export default ShowAudioLength
