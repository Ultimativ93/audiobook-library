import React from 'react';

import FetchAudio from '../../tasks/FetchAudio';
import SelectStoryAudio from './SelectStoryAudio';
import MuChoiFormat from './layoutDrawerFormats/MuChoiFormat';
import { updateNodeLabelWrapper } from './LayoutDrawerFunctions';

const LayoutDrawerFormatProvider = ({ nodeData, setNodes }) => {
    const audioData = FetchAudio();
    console.log("Audio Data in LDFP: ", audioData);

    console.log("Node Data in LDFP", nodeData);

    switch (nodeData.type) {
        case 'start':
            return {
                // has to be created
            }
        case 'muChoi':
            return (
                <MuChoiFormat nodeData={nodeData} setNodes={setNodes}/>
            )
        case 'bridge':
            return {
                // ...
            }
        default:
            console.log("Default in LayoutFormatProvider, check it!");
            // create default functionality
            return null;
    }
}

export default LayoutDrawerFormatProvider;
