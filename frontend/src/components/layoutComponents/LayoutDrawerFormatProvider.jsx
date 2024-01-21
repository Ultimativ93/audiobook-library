import React from 'react'
import { Input } from '@chakra-ui/react';
import {
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerContent,
} from '@chakra-ui/react'

import FetchAudio from '../tasks/FetchAudio';
import SelectStoryAudio from './SelectStoryAudio';

const LayoutDrawerFormatProvider = (nodeData, updateNodeLabel) => {

    const audioData = FetchAudio();
    console.log('AudioData in Layout..Provider: ', audioData);

    const handleInputChange = (event) => {
        const newLabel = event.target.value;
        nodeData.updateNodeLabel(nodeData.nodeData.id, newLabel);
    }

    switch (nodeData.nodeData.type) {
        case 'start':
            return {
                // has to be created
            }
        case 'muChoi':
            return (
                <DrawerContent>
                    <DrawerHeader>{`Edit Node: ${nodeData.nodeData.data.label}`}</DrawerHeader>

                    <DrawerBody>
                        <Input placeholder='Node name..' onChange={handleInputChange} />
                        <SelectStoryAudio />
                        
                    </DrawerBody>

                    <DrawerFooter>
                        {/* ... */}
                    </DrawerFooter>
                </DrawerContent>

            )
        case 'bridge':
            return {

            }
        default:
            return console.log("Default in LayoutFormatProvier, check it!")
        // create default functionality
    }
}

export default LayoutDrawerFormatProvider;