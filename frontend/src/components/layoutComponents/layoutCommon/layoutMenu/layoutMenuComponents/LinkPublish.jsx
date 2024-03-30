import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModalsState } from '../ModalsStateContext';

// "LinkPublish.jsx" component, is used for the link for the LayoutMenuModalPublish on the left side of the editor. Can be used later on for linking from other modals.
// Is a child of "LayoutMenuModalPreview" component
const LinkPublish = () => {
    const { setModalsState } = useModalsState();
    const openPublishModal = () => {
        setModalsState(prevState => ({
            ...prevState,
            isPublishModalOpen: true,
        }));
    };

    return (
        <div className='link-publish-container'>
            <Button colorScheme='highlightColor' size='md' mt='2' onClick={openPublishModal}>Publish</Button>
        </div>
    )
}

export default LinkPublish