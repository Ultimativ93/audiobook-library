import React from 'react';
import { Input } from '@chakra-ui/react';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

import LayoutDrawerFormatProvider from './LayoutDrawerFormatProvider';

function LayoutDrawer({ isOpen, onClose, nodeData, updateNodeLabel }) {
    const btnRef = React.useRef();

    if (!nodeData || !nodeData.data) {
        // If nodeData is null or its data property is null, you can decide what to render in this case
        return null;
    }

    console.log("Node Data in Drawer: " + JSON.stringify(nodeData))

    const nodeFormat = LayoutDrawerFormatProvider(nodeData, updateNodeLabel);

    console.log("Node Format: ", nodeFormat);

    // is beeing transfered to LayoutDrawerFormatProvier, delete later on
    const handleInputChange = (event) => {
        const newLabel = event.target.value;
        updateNodeLabel(nodeData.id, newLabel)
    }

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>

                    <DrawerBody>
                        <Input placeholder='Node name..' onChange={handleInputChange}/>
                    </DrawerBody>

                    <DrawerFooter>
                        {/* ... */}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default LayoutDrawer;


