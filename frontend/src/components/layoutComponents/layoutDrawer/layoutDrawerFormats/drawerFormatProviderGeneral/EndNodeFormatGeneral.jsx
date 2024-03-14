import React from 'react'
import { DrawerBody } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import SelectEnd from '../../drawerComponents/SelectEnd';
import LinkUpload from '../../drawerComponents/LinkUpload';
import SetNote from '../../drawerComponents/SetNote';

const EndNodeFormatGeneral = ({ nodeData, setNodes, audiobookTitle }) => {
    return (
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SelectEnd nodeData={nodeData} setNodes={setNodes} />
                <SetNote nodeData={nodeData} setNodes={setNodes} />
                <LinkUpload />
            </DrawerBody>
    )
}

export default EndNodeFormatGeneral