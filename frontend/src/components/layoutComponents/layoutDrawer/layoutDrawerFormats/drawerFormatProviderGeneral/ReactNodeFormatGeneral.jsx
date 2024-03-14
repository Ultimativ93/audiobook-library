import React from 'react';
import { DrawerBody } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import SelectInteraktionSignal from '../../drawerComponents/SelectInteractionSignal';
import LinkUpload from '../../drawerComponents/LinkUpload';
import SetNote from '../../drawerComponents/SetNote';

const ReactNodeFormatGeneral = ({ nodeData, setNodes, audiobookTitle }) => {
    return (
            <DrawerBody>
                <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SelectInteraktionSignal nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SetNote nodeData={nodeData} setNodes={setNodes} />
                <LinkUpload />
            </DrawerBody>
    )
}

export default ReactNodeFormatGeneral