import React, { useState } from 'react'
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import ShowAudioLength from './ShowAudioLength';

const SelectAnswerProcessAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedAnswerProcessAudio, setSelectedAnswerProcessAudio] = useState(nodeData.data.answerProcessAudio || '');
    const audioUsage = useAudioUsage(audioPaths);

    return (
        <>
            <h4>Setlect Answer Process Audio</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '20px' }}>
                    <Select
                        placeholder='Select Answer Process Audio ...'
                        value={selectedAnswerProcessAudio}
                        onChange={(event) => {
                            setSelectedAnswerProcessAudio(event.target.value);
                            updateNodeProperty(setNodes, nodeData, 'answerProcessAudio', event.target.value);
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
                </div>
                <div>
                    <SwitchBackgroundAudio backgroundAudioFor={'answerProcessAudio'} nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                </div>
                <div>
                    {selectedAnswerProcessAudio && (
                        <ShowAudioLength nodeData={nodeData} setNodes={setNodes} audioName={selectedAnswerProcessAudio} />
                    )}
                </div>
            </div>
        </>
    );
};

export default SelectAnswerProcessAudio;
