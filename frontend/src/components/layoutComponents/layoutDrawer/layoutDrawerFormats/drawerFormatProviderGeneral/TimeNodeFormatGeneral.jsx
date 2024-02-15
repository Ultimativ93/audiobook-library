import React from 'react';
import { DrawerBody, DrawerFooter, DrawerHeader } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import SelectInteraktionSignal from '../../drawerComponents/SelectInteractionSignal';

const TimeNodeFormatGeneral = ({ nodeData, setNodes, audiobookTitle }) => {
    return (
        <>
            <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SelectInteraktionSignal nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
            </DrawerBody>
            <DrawerFooter>
            </DrawerFooter>
        </>
    )
}

export default TimeNodeFormatGeneral