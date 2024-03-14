import React, { useState, useEffect } from 'react';
import { Switch, Select } from '@chakra-ui/react';

import FetchAudio from '../../src/components/tasks/editorTasks/FetchAudio';
import { useAudioUsage, updateBackgroundAudio } from '../../src/components/layoutComponents/layoutDrawer/LayoutDrawerFunctions';

const SwitchBackgroundAudio = ({ backgroundAudioFor, nodeData, setNodes, audiobookTitle }) => {
    const [selectedAudio, setSelectedAudio] = useState('');
    const [showAudio, setShowAudio] = useState(false);
    const audioPaths = FetchAudio(audiobookTitle);
    const audioUsage = useAudioUsage(audioPaths);

    const handleAudioChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedAudio(selectedValue);
        updateBackgroundAudio(setNodes, nodeData, backgroundAudioFor, selectedValue);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
                checked={showAudio}
                style={{ marginRight: '5px' }}
            />
            <div>
                <h4 style={{ margin: '0', marginBottom: '2px', fontSize: '10px' }}>Background Audio</h4>
            </div>
            
        </div>
    )
}

export default SwitchBackgroundAudio;
