import React from 'react';

import MuChoiFormatQuestions from './MuChoiFormatQuestions';
import TimeNodeFormatQuestions from './TimeNodeFormatQuestions';
import MuAnsFormatQuestions from './MuAnsFormatQuestions';
import ReactNodeFromatQuestions from './ReactNodeFormatQuestions';
import InputNodeFormatQuestions from './InputNodeFormatQuestions';

// "DrawerFormatProviderQuestions.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the format provider for the different nodes used for the questions tab of the drawer.
// Is a child of "LayoutDrawer" component.
const DrawerFormatProviderQuestions = ({ nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
    switch (nodeData.type) {
        case 'muChoi':
            return (
                <MuChoiFormatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'timeNode':
            return (
                <TimeNodeFormatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'muAns':
            return (
                <MuAnsFormatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'reactNode':
            return (
                <ReactNodeFromatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        case 'inputNode':
            return (
                <InputNodeFormatQuestions nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            )
        default:
            console.log('There was a problem setting the case of format for your node in DrawerFormatProviderQuestions, please contact the support!');
            alert('There was a problem setting the case of format for your node in DrawerFormatProviderQuestions, please contact the support!')
            return null;
    }
}

export default DrawerFormatProviderQuestions;
