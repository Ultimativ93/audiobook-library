import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';

const SelectStoryAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedStoryAudio, setSelectedAudioStory] = useState(nodeData.data.audioStory || '');
    const audioUsage = useAudioUsage(audioPaths);

    useEffect(() => {
        setSelectedAudioStory(nodeData.data.audioStory || '');
    }, [nodeData.data.audioStory]);

    return (
        <>
            <h4>Story Audio</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '20px' }}>
                    <Select
                        placeholder='Select Story Audio ...'
                        value={selectedStoryAudio}
                        onChange={(event) => {
                            setSelectedAudioStory(event.target.value);
                            updateNodeProperty(setNodes, nodeData, 'audioStory', event.target.value);
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
                    <SwitchBackgroundAudio backgroundAudioFor={'audioStory'} nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                </div>
            </div>
        </>
    );
};

export default SelectStoryAudio;
