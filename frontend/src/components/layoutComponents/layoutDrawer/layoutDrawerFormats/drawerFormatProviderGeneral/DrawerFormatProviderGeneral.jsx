import React from 'react';

import MuChoiFormatGeneral from './MuChoiFormatGeneral';
import EndNodeFormatGeneral from './EndNodeFormatGeneral';

const DrawerFormatProviderGeneral = ({ nodeData, setNodes }) => {

    switch (nodeData.type) {
        case 'start':
            return {
                // has to be created
            }
        case 'muChoi':
            return (
                <MuChoiFormatGeneral nodeData={nodeData} setNodes={setNodes} />
            )
        case 'bridge':
            return {
                // ...
            }
        case 'endNode':
            return (
                <EndNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} />
            )
        default:
            console.log("Default in LayoutFormatProvider, check it!");
            // create default functionality
            return null;
    }
}

export default DrawerFormatProviderGeneral;
