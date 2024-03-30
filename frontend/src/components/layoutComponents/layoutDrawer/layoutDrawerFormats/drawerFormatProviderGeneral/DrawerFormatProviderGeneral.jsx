import React from 'react';

import MuChoiFormatGeneral from './MuChoiFormatGeneral';
import EndNodeFormatGeneral from './EndNodeFormatGeneral';
import BridgeNodeFormatGeneral from './BridgeNodeFormatGeneral';
import TimeNodeFormatGeneral from './TimeNodeFormatGeneral';
import MuAnsFormatGeneral from './MuAnsFormatGeneral';
import ReactNodeFormatGeneral from './ReactNodeFormatGeneral';
import InputNodeFormatGeneral from './InputNodeFormatGeneral';

// "DrawerFormatProviderGeneral.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the format providers for the different node types.
// It is a child of "LayoutDrawer" component.
const DrawerFormatProviderGeneral = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
    switch (nodeData.type) {
        case 'muChoi':
            return (
                <MuChoiFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'bridgeNode':
            return (
                <BridgeNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'timeNode':
            return (
                <TimeNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'muAns':
            return (
                <MuAnsFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'reactNode':
            return (
                <ReactNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'inputNode':
            return (
                <InputNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'endNode':
            return (
                <EndNodeFormatGeneral nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        default:
            console.log('There was a problem setting the case of format for your node in DrawerFormatProviderGeneral, please contact the support!');
            alert('There was a problem setting the case of format for your node in DrawerFormatProviderGeneral, please contact the support!')
            return null;
    }
}

export default DrawerFormatProviderGeneral;
