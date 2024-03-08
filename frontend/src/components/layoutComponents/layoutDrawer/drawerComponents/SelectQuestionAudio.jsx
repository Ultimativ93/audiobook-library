import React, { useState } from 'react';
import { Select } from '@chakra-ui/react';

import './drawer-components.css'

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';

const SelectQuestionAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedQuestionAudio, setSelectedQuestionAudio] = useState(nodeData.data.questionAudio || '');
    const audioUsage = useAudioUsage(audioPaths);

    return (
        <div className='question-audio-container'>
            <h4>Select Question Audio</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '20px' }}>
                    <Select
                        placeholder='Select Question Audio ...'
                        value={selectedQuestionAudio}
                        onChange={(event) => {
                            setSelectedQuestionAudio(event.target.value);
                            updateNodeProperty(setNodes, nodeData, 'questionAudio', event.target.value);
                        }}
                        focusBorderColor='darkButtons'
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
                </div>
                <div>
                    <SwitchBackgroundAudio backgroundAudioFor={'questionAudio'} nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                </div>
            </div>
        </div>
    );
};

export default SelectQuestionAudio;
