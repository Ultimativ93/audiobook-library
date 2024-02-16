import React, { useState } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';

const SelectInteractionSignalAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedAudio, setSelectedAudio] = useState(nodeData.data.interactionSignalAudio || '');
    const audioUsage = useAudioUsage(audioPaths);

    return (
        <>
            <h4>Select Interaction Audio</h4>
            <Select
                placeholder='Select Interaction Audio ...'
                value={selectedAudio}
                onChange={(event) => {
                    setSelectedAudio(event.target.value);
                    updateNodeProperty(setNodes, nodeData, 'interactionSignalAudio', event.target.value);
                }}
            >
                {audioPaths.map((audio, index) => {
                    const color = audioUsage[audio.audioName] ? 'green' : 'orange';
                    return (
                        <option
                            key={index}
                            value={audio.audioName}
                            style={{ color: color }}
                        >
                            {audio.audioName}
                        </option>
                    )
                })}


            </Select>
        </>
    )
}

export default SelectInteractionSignalAudio;
