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

    const filteredAudioPaths = audioPaths.filter(audio => audio.audioCategory === 'answerProcessAudio' || audio.audioCategory === 'universal');

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
                        focusBorderColor='darkButtons'
                    >
                        {filteredAudioPaths.map((audio, index) => {
                            const color = audioUsage[audio.audioName] ? '#C6F6D5' : 'inherit';
                            return (
                                <option
                                    key={index}
                                    value={audio.audioName}
                                    style={{ backgroundColor: color }}
                                >
                                    {audio.audioName}
                                    {audioUsage[audio.audioName] ? <span style={{ color: 'green', marginLeft: '10px' }}> ✓</span> : null}
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