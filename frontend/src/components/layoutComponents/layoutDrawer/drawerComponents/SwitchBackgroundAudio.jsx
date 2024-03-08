import React, { useState, useEffect } from 'react';
import { Switch, Select } from '@chakra-ui/react';

import './drawer-components.css';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { useAudioUsage, updateBackgroundAudio } from '../LayoutDrawerFunctions';

const SwitchBackgroundAudio = ({ backgroundAudioFor, nodeData, setNodes, audiobookTitle }) => {
    const [selectedAudio, setSelectedAudio] = useState('');
    const [showAudio, setShowAudio] = useState(false);
    const audioPaths = FetchAudio(audiobookTitle);
    const audioUsage = useAudioUsage(audioPaths);

    const handleAudioChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedAudio(selectedValue);
        updateBackgroundAudio(setNodes, nodeData, backgroundAudioFor, selectedValue, showAudio);
    };

    const handleSwitchChange = (event) => {
        const isChecked = event.target.checked;
        setShowAudio(isChecked);
        updateBackgroundAudio(setNodes, nodeData, backgroundAudioFor, selectedAudio, isChecked);
    };

    useEffect(() => {
        if (nodeData.data && Array.isArray(nodeData.data.backgroundAudio)) {
            const selectedAudioForBackground = nodeData.data.backgroundAudio.find(entry => entry.audio === backgroundAudioFor);
            if (selectedAudioForBackground) {
                setSelectedAudio(selectedAudioForBackground.backgroundAudio);
                setShowAudio(true);
            } else {
                setSelectedAudio('');
                setShowAudio(false);
            }
        } else {
            setSelectedAudio('');
            setShowAudio(false);
        }
    }, [backgroundAudioFor, nodeData]);

    return (
        <div className='switch-background-audio-container'>
            <Switch
                isChecked={showAudio}
                onChange={(event) => handleSwitchChange(event)}
                style={{ marginRight: '5px' }}
                colorScheme='darkButtons'
            />
            <div>
                <h4>Background Audio</h4>
            </div>
            {showAudio && (
                <Select
                    placeholder={`Bg Audio: ${backgroundAudioFor}`}
                    value={selectedAudio}
                    onChange={handleAudioChange}
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
            )}
        </div>
    );
};

export default SwitchBackgroundAudio;