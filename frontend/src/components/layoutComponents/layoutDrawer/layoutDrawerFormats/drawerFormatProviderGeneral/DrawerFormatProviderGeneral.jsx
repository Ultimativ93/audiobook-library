import React from 'react';

import MuChoiFormatGeneral from './MuChoiFormatGeneral';
import EndNodeFormatGeneral from './EndNodeFormatGeneral';
import BridgeNodeFormatGeneral from './BridgeNodeFormatGeneral';
import TimeNodeFormatGeneral from './TimeNodeFormatGeneral';
import MuAnsFormatGeneral from './MuAnsFormatGeneral';

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
        case 'bridgeNode':
            return (
                <BridgeNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} />
            )
        case 'timeNode':
            return (
                <TimeNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} />
            )
        case 'muAns':
            return (
                <MuAnsFormatGeneral nodeData={nodeData} setNodes={setNodes} />
            )
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
