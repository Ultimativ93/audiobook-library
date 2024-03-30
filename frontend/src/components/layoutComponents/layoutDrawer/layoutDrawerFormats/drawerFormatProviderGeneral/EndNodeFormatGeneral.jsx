import React from 'react'
import { DrawerBody } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import SelectEnd from '../../drawerComponents/SelectEnd';
import LinkUpload from '../../drawerComponents/LinkUpload';
import SetNote from '../../drawerComponents/SetNote';

// "EndNodeFormatGeneral.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the components used for the general tab of the drawer for an End node.
// Is a child of "DrawerFormatProviderGeneral" component.
const EndNodeFormatGeneral = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
    return (
        <DrawerBody>
            <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
            <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            <SelectEnd nodeData={nodeData} setNodes={setNodes} />
            <SetNote nodeData={nodeData} setNodes={setNodes} />
            <LinkUpload />
        </DrawerBody>
    )
}

export default EndNodeFormatGeneral