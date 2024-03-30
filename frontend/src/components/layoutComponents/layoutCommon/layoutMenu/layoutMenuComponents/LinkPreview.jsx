import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModalsState } from '../ModalsStateContext';

// "LinkPreview.jsx" component, is used for the link for the LayoutMenuModalPreview on the left side of the editor. Can be used later on for linking from other modals.
// Is a child of "LayoutMenuModalPublish" component
const LinkPreview = () => {
    const { setModalsState } = useModalsState();
    const openPreviewModal = () => {
        setModalsState(prevState => ({
            ...prevState,
            isPreviewModalOpen: true,
        }));
    };

    return (
        <div className='link-preview-container'>
            <Button colorScheme='lightButtons' size='sm' mt='2' onClick={openPreviewModal}>Preview</Button>
        </div>
    )
}

export default LinkPreview