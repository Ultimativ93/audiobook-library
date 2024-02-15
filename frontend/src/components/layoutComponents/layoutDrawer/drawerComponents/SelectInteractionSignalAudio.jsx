import React, { useState } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectInteractionSignalAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    console.log("audiobookTitle", audiobookTitle);
    const [selectedAudio, setSelectedAudio] = useState(nodeData.data.interactionSignalAudio || '');

    console.log("SelectAudio - nodeData: ", nodeData);
    console.log("SelectAudio - audioPaths: ", audioPaths);

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
                {audioPaths.map((audio, index) => (
                    <option key={index} value={audio.audioName}>
                        {audio.audioName}
                    </option>
                ))}
            </Select>
        </>
    )
}

export default SelectInteractionSignalAudio;
