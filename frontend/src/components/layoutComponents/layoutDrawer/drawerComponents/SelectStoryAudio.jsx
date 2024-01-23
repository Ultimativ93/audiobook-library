import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/FetchAudio';
import { updateStoryAudio } from '../LayoutDrawerFunctions';

const SelectStoryAudio = ({ nodeData, setNodes }) => {
    // Call fetchAudio to get audio-status
    const audioPaths = FetchAudio();
    const [selectedStoryAudio, setSelectedAudioStory] = useState(nodeData.data.audioStory || '');

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
                    updateStoryAudio(setNodes, nodeData, event);
                }}
            >
                {/* Using audiopaths to create options */}
                {audioPaths.map((audio, index) => (
                    <option key={index} value={audio.audioName}>
                        {audio.audioName}
                    </option>
                ))}
            </Select>
        </>
    );
};

export default SelectStoryAudio;
