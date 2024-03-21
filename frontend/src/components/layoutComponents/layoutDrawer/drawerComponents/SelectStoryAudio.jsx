import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';

import './drawer-components.css';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import { updateNodeProperty, useAudioUsage } from '../LayoutDrawerFunctions';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';

const SelectStoryAudio = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
    const [audioPaths, setAudioPaths] = useState([]);
    const [selectedStoryAudio, setSelectedAudioStory] = useState(nodeData.data.audioStory || '');
    const audioUsage = useAudioUsage(audioPaths);

    useEffect(() => {
        const fetchAudioPaths = async () => {
            const paths = await FetchAudio(audiobookTitle);
            setAudioPaths(paths);
            setFileChange(false);
        };
        fetchAudioPaths();
    }, [audiobookTitle, nodeData, fileChange]);

    useEffect(() => {
        setSelectedAudioStory(nodeData.data.audioStory || '');
    }, [nodeData.data.audioStory]);

    const filteredAudioPaths = audioPaths.filter(audio => audio.audioCategory === 'story' || audio.audioCategory === 'universal');

    return (
        <div className='select-story-audio-container'>
            <h4>Story Audio</h4>
            <div className='select-story-audio'>
                <div style={{ marginRight: '15px' }}>
                    <Select
                        placeholder='Select Story Audio ...'
                        value={selectedStoryAudio}
                        onChange={(event) => {
                            setSelectedAudioStory(event.target.value);
                            updateNodeProperty(setNodes, nodeData, 'audioStory', event.target.value);
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
                    <SwitchBackgroundAudio backgroundAudioFor={'audioStory'} nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange}/>
                </div>
            </div>
        </div>
    );
};

export default SelectStoryAudio;
