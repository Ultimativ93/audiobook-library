import React from 'react'
import { DrawerBody } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';

const BridgeNodeFormatGeneral = ({ nodeData, setNodes, audiobookTitle }) => {
    return (
        <div>
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            </DrawerBody>
        </div>
    )
}

export default BridgeNodeFormatGeneral