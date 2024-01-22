import React from 'react';
import { Drawer, DrawerOverlay } from '@chakra-ui/react';
import LayoutDrawerFormatProvider from './LayoutDrawerFormatProvider';

function LayoutDrawer({ isOpen, onClose, nodeData, setNodes }) {
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
                <LayoutDrawerFormatProvider nodeData={nodeData} setNodes={setNodes} />
            </Drawer>
        </>
    );
}

export default LayoutDrawer;
