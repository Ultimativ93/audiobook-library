import React, { useState } from 'react';
import { Switch, Select } from '@chakra-ui/react';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';

const SelectBackgroundAudio = ({ nodeData, setNodes, audiobookTitle }) => {
    const [showAudio, setShowAudio] = useState(nodeData.data.backgroundAudioSelected === 'true');
    const audioPaths = FetchAudio(audiobookTitle);
    const [selectedAudio, setSelectedAudio] = useState(nodeData.data.backgroundAudio || '')
    const audioUsage = useAudioUsage(audioPaths);

    return (
        <>
            <h4>Background Audio</h4>
            <Switch
                defaultChecked={showAudio}
                onChange={(event) => {
                    updateNodeProperty(setNodes, nodeData, 'backgroundAudioSelected', event.target.checked.toString());
                    setShowAudio(event.target.checked);
                }}
            />
            {showAudio && (
                <>
                    <h4>Select Backgroung Audio</h4>
                    <Select
                        placeholder='Select Background Audio ...'
                        value={selectedAudio}
                        onChange={(event) => {
                            setSelectedAudio(event.target.value);
                            updateNodeProperty(setNodes, nodeData, 'backgroundAudio', event.target.value);
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
                </>
            )
            }
        </>
    )
}

export default SelectBackgroundAudio;