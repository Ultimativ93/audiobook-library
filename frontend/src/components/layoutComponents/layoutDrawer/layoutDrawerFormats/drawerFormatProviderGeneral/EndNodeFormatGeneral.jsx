import React from 'react'
import { DrawerBody, DrawerFooter, DrawerHeader } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import SelectEnd from '../../drawerComponents/SelectEnd';

const EndNodeFormatGeneral = ({ nodeData, setNodes }) => {
    return (
        <>
            <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} />
                <SelectEnd nodeData={nodeData} setNodes={setNodes} />
            </DrawerBody>
            <DrawerFooter>
            </DrawerFooter>
        </>
    )
}

export default EndNodeFormatGeneral