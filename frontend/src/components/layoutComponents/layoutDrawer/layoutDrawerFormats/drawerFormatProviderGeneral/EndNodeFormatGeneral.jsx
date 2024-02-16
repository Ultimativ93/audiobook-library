import React from 'react'
import { DrawerBody, DrawerHeader } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import SelectEnd from '../../drawerComponents/SelectEnd';

const EndNodeFormatGeneral = ({ nodeData, setNodes, audiobookTitle }) => {
    return (
        <>
            <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SelectEnd nodeData={nodeData} setNodes={setNodes} />
            </DrawerBody>
        </>
    )
}

export default EndNodeFormatGeneral