import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';

const SelectStoryAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedStoryAudio, setSelectedAudioStory] = useState(nodeData.data.audioStory || '');
    const audioUsage = useAudioUsage(audioPaths);

    useEffect(() => {
        setSelectedAudioStory(nodeData.data.audioStory || '');
    }, [nodeData.data.audioStory]);

    return (
        <>
            <h4>Select Audio Story</h4>
            <Select
                placeholder='Select Story Audio ...'
                value={selectedStoryAudio}
                onChange={(event) => {
                    setSelectedAudioStory(event.target.value);
                    updateNodeProperty(setNodes, nodeData, 'audioStory', event.target.value);
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
                    );
                })}
            </Select>
        </>
    );
};

export default SelectStoryAudio;
