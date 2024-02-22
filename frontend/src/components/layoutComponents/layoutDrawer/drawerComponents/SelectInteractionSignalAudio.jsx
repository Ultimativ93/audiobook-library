import React, { useState } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';

const SelectInteractionSignalAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedAudio, setSelectedAudio] = useState(nodeData.data.interactionSignalAudio || '');
    const audioUsage = useAudioUsage(audioPaths);

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ marginRight: '20px' }}>
                <Select
                    placeholder='Select Interaction Audio ...'
                    value={selectedAudio}
                    onChange={(event) => {
                        setSelectedAudio(event.target.value);
                        updateNodeProperty(setNodes, nodeData, 'interactionSignalAudio', event.target.value);
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
