import React from 'react'
import {
    Select,
} from '@chakra-ui/react'

import FetchAudio from '../tasks/FetchAudio'

const SelectStoryAudio = () => {
    // Call fetchAudio to get audio-status
    const audioPaths = FetchAudio();

    return (
        <div>
            <h4>Description</h4>
            <Select placeholder='Auswählen...'>
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
