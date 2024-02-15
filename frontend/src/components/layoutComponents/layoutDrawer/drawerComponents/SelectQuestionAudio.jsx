import React, { useState } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectQuestionAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);

    const [selectedQuestionAudio, setSelectedQuestionAudio] = useState(nodeData.data.questionAudio || '');
    
    return (
        <>
            <h4>Select Question Audio</h4>
            <Select
                placeholder='Select Question Audio ...'
                value={selectedQuestionAudio}
                onChange={(event) => {
                    setSelectedQuestionAudio(event.target.value);
                    updateNodeProperty(setNodes, nodeData, 'questionAudio', event.target.value);
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



export default SelectQuestionAudio