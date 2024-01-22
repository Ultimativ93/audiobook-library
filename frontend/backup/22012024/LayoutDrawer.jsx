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
        // If nodeData is null or its data property is null, we can decide what to render in this case !!!!!!
        return null;
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
                <LayoutDrawerFormatProvider nodeData={nodeData} updateNodeLabel={updateNodeLabel}/>
            </Drawer>
        </>
    );
}

export default LayoutDrawer;