import React from 'react'
import { DrawerBody } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import LinkUpload from '../../drawerComponents/LinkUpload';
import SetNote from '../../drawerComponents/SetNote';

const BridgeNodeFormatGeneral = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
    return (
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                <SetNote nodeData={nodeData} setNodes={setNodes} />
                <LinkUpload />
            </DrawerBody>
    )
}

export default BridgeNodeFormatGeneral