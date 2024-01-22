import React from 'react';
import {
    Select,
} from '@chakra-ui/react';

import FetchAudio from '../../tasks/FetchAudio';
import { updateAudioStory } from './LayoutDrawerFunctions';

const SelectStoryAudio = (nodeData, setNodes) => {
    // Call fetchAudio to get audio-status
    const audioPaths = FetchAudio();

    return (
        <div>
            <h4>Select Audio Story</h4>
            <Select placeholder='Select Audio Story ...' onChange={updateAudioStory}>
                {/* Using audiopaths to create options */}
                {audioPaths.map((audio, index) => (
                    <option key={index} value={audio.audioName}>
                        {audio.audioName}
                    </option>
                ))}
            </Select>
        </div>
    )
}

export default SelectStoryAudio
