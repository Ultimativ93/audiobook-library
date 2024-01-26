import React from 'react'
import { DrawerBody, DrawerFooter, DrawerHeader } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';

const BridgeNodeFormatGeneral = ({ nodeData, setNodes }) => {

    console.log("NodeData in BridgeNode:", nodeData);

    return (
        <div>
            <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} />
            </DrawerBody>
            <DrawerFooter>
            </DrawerFooter>
        </div>
    )
}

export default BridgeNodeFormatGeneral