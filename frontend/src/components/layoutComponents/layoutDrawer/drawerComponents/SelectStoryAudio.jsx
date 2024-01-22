import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import FetchAudio from '../../../tasks/FetchAudio';
import { updateAudioStory } from '../LayoutDrawerFunctions';

const SelectStoryAudio = ({ nodeData, setNodes }) => {
    // Call fetchAudio to get audio-status
    const audioPaths = FetchAudio();
    const [selectedAudioStory, setSelectedAudioStory] = useState(nodeData.data.audioStory || ''); 

    useEffect(() => {
        setSelectedAudioStory(nodeData.data.audioStory || ''); 
    }, [nodeData.data.audioStory]);

    return (
        <div>
            <h4>Select Audio Story</h4>
            <Select
                placeholder='Select Audio Story ...'
                value={selectedAudioStory}
                onChange={(event) => {
                    setSelectedAudioStory(event.target.value);
                    updateAudioStory(setNodes, nodeData, event);
                }}
            >
                {/* Using audiopaths to create options */}
                {audioPaths.map((audio, index) => (
                    <option key={index} value={audio.audioName}>
                        {audio.audioName}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default SelectStoryAudio;
