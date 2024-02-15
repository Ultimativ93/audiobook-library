import React from 'react';

import MuChoiFormatGeneral from './MuChoiFormatGeneral';
import EndNodeFormatGeneral from './EndNodeFormatGeneral';
import BridgeNodeFormatGeneral from './BridgeNodeFormatGeneral';
import TimeNodeFormatGeneral from './TimeNodeFormatGeneral';
import MuAnsFormatGeneral from './MuAnsFormatGeneral';
import ReactNodeFormatGeneral from './ReactNodeFormatGeneral';
import InputNodeFormatGeneral from './InputNodeFormatGeneral';

const DrawerFormatProviderGeneral = ({ nodeData, setNodes, audiobookTitle }) => {

    switch (nodeData.type) {
        case 'start':
            return {
                // has to be created
            }
        case 'muChoi':
            return (
                <MuChoiFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            )
        case 'bridgeNode':
            return (
                <BridgeNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            )
        case 'timeNode':
            return (
                <TimeNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            )
        case 'muAns':
            return (
                <MuAnsFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            )
        case 'reactNode':
            return (
                <ReactNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            )
        case 'inputNode':
            return (
                <InputNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            )
        case 'endNode':
            return (
                <EndNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            )
        default:
            console.log("Default in LayoutFormatProvider, check it!");
            // create default functionality
            return null;
    }
}

export default DrawerFormatProviderGeneral;
