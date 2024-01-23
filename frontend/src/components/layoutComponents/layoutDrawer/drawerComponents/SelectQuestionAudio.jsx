import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/FetchAudio';
import { updateQuestionAudio } from '../LayoutDrawerFunctions';

const SelectQuestionAudio = ({ nodeData, setNodes }) => {
    const audioPaths = FetchAudio();

    const [selectedQuestionAudio, setSelectedQuestionAudio] = useState(nodeData.data.questionAudio || '');

    return (
        <>
            <h4>Select Question Audio</h4>
            <Select
                placeholder='Select Question Audio ...'
                value={selectedQuestionAudio}
                onChange={(event) => {
                    setSelectedQuestionAudio(event.target.value);
                    updateQuestionAudio(setNodes, nodeData, event);
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
    )
}

export default SelectQuestionAudio