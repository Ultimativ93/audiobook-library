import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModalsState } from '../ModalsStateContext';

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
            <Button colorScheme='lightButtons' size="sm" mt="2" onClick={openPreviewModal}>Preview</Button>
        </div>
    )
}

export default LinkPreview