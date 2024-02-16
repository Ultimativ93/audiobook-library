import React, { useEffect, useState } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';

const SelectQuestionAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedQuestionAudio, setSelectedQuestionAudio] = useState(nodeData.data.questionAudio || '');
    const audioUsage = useAudioUsage(audioPaths);

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



export default SelectQuestionAudio