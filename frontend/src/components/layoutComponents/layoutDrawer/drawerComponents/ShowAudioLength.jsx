import React, { useEffect, useState } from 'react'

import { getAudioPathFromName, getAudioFromPath, getCurrentAudioLength } from '../../../tasks/playerTasks/PlayerLogic';
import { updateNodeProperty } from '../LayoutDrawerFunctions';

const ShowAudioLength = ({ nodeData, setNodes, audioName }) => {
    const [audioLength, setAudioLength] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const audioPath = await getAudioPathFromName(audioName);
            const audioBlob = await getAudioFromPath(audioPath);
            const newAudioLength = await getCurrentAudioLength(audioBlob);
            convertToTime(newAudioLength.toFixed(2));
        }

        fetchData();
    }, [audioName])

    useEffect(() => {
        if (audioLength) {
            updateNodeProperty(setNodes, nodeData, 'answerProcessAudioLength', audioLength);
        }
    }, [audioLength, setNodes, nodeData])

    const convertToTime = (newAudioLength) => {
        const minutes = Math.floor(newAudioLength / 60);
        const remainingSeconds = Math.floor(newAudioLength % 60);
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formatedSeconds = remainingSeconds.toString().padStart(2, '0');
        const formatedAudioLength = formattedMinutes + ':' + formatedSeconds;
        setAudioLength(formatedAudioLength);
    }

    return (
        <div style={{marginLeft: '15px'}}>
            <h4>Audio Length</h4>
            {audioLength}
        </div>
    )
}

export default ShowAudioLength
