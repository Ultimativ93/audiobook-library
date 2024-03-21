import React, { useState, useEffect } from 'react';
import { Switch, Select } from '@chakra-ui/react';

import './drawer-components.css';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { useAudioUsage, updateBackgroundAudio } from '../LayoutDrawerFunctions';

const SwitchBackgroundAudio = ({ backgroundAudioFor, nodeData, setNodes, audiobookTitle }) => {
    const [selectedAudio, setSelectedAudio] = useState('');
    const [showAudio, setShowAudio] = useState(false);
    const [audioPaths, setAudioPaths] = useState([]);
    const audioUsage = useAudioUsage(audioPaths);
    const [audioIsUsed, setAudioIsUsed] = useState(false);

    useEffect(() => {
        const fetchAudioPaths = async () => {
            const paths = await FetchAudio(audiobookTitle);
            setAudioPaths(paths);
        };

        fetchAudioPaths();
    }, [audiobookTitle, nodeData]);

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

        if (selectedAudio) {
            setAudioIsUsed(audioUsage[selectedAudio]);
        } else {
            setAudioIsUsed(false);
        }
    }, [backgroundAudioFor, nodeData, selectedAudio, audioUsage]);

    const handleAudioChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedAudio(selectedValue);
        updateBackgroundAudio(setNodes, nodeData, backgroundAudioFor, selectedValue, showAudio);
        setAudioIsUsed(audioUsage[selectedValue]);
    };

    const handleSwitchChange = (event) => {
        const isChecked = event.target.checked;
        setShowAudio(isChecked);
        updateBackgroundAudio(setNodes, nodeData, backgroundAudioFor, selectedAudio, isChecked);
    };


    const filteredAudioPaths = audioPaths.filter(audio => audio.audioCategory === 'background' || audio.audioCategory === 'universal');

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
            )}
        </div>
    );
};

export default SwitchBackgroundAudio;
