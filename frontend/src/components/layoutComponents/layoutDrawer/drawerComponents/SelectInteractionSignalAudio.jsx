import React, { useState } from 'react';
import { Select } from '@chakra-ui/react';

import './drawer-components.css';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';

const SelectInteractionSignalAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedAudio, setSelectedAudio] = useState(nodeData.data.interactionSignalAudio || '');
    const audioUsage = useAudioUsage(audioPaths);

    const filteredAudioPaths = audioPaths.filter(audio => audio.audioCategory === 'interaction' || audio.audioCategory === 'universal');

    return (
        <div className='select-interaction-signal-audio'>
            <div style={{ marginRight: '20px' }}>
                <Select
                    placeholder='Select Interaction Audio ...'
                    value={selectedAudio}
                    onChange={(event) => {
                        setSelectedAudio(event.target.value);
                        updateNodeProperty(setNodes, nodeData, 'interactionSignalAudio', event.target.value);
                    }}
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
                        )
                    })}
                </Select>
            </div>
            <div>
                <SwitchBackgroundAudio backgroundAudioFor={'interactionSignal'} nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            </div>
        </div>
    )
}

export default SelectInteractionSignalAudio;