import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';

import './drawer-components.css';

import FetchAudio from '../../../tasks/editorTasks/FetchAudio';
import SwitchBackgroundAudio from './SwitchBackgroundAudio';
import { updateNodeProperty, useAudioUsage } from '../../../tasks/drawerTasks/LayoutDrawerFunctions';

// "SelectInteractionSignalAudio.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the input and deselection of the audio for SelectInteractionSignalAudio
// Its parent is the "SelectInteractioNSignal" component.
// It is a child of "MuAnsFormatQuestions", "MuChoiFormatQuestions", "ReactNodeFormatQuestions" and "TimeNodeFormatQuestions" component.
const SelectInteractionSignalAudio = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
    const [audioPaths, setAudioPaths] = useState([]);
    const audioUsage = useAudioUsage(audioPaths);
    const [selectedAudio, setSelectedAudio] = useState(nodeData.data.interactionSignalAudio || '');

    useEffect(() => {
        const fetchAudioPaths = async () => {
            const paths = await FetchAudio(audiobookTitle);
            setAudioPaths(paths);
            setFileChange(false);
        };

        fetchAudioPaths();
    }, [audiobookTitle, nodeData, fileChange]);

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
                <SwitchBackgroundAudio backgroundAudioFor={'interactionSignal'} nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            </div>
        </div>
    )
}

export default SelectInteractionSignalAudio;