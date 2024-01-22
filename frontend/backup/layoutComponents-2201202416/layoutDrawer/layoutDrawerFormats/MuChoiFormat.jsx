import React from 'react';
import { Input } from '@chakra-ui/react';
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerContent } from '@chakra-ui/react';

import SelectStoryAudio from '../SelectStoryAudio';
import { updateNodeLabelWrapper } from '../LayoutDrawerFunctions';

const MuChoiFormat = ({ nodeData, setNodes }) => {

    console.log("NodeData in MuChoiFormat", nodeData);

    return (
        <DrawerContent>
            <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
            <DrawerBody>
                <Input placeholder='Node name..' onChange={(event) => updateNodeLabelWrapper(setNodes, nodeData, event)} />
                <SelectStoryAudio nodeData={nodeData} setNodes={setNodes}/>
            </DrawerBody>
            <DrawerFooter>

            </DrawerFooter>
        </DrawerContent>
    )
}

export default MuChoiFormat;
