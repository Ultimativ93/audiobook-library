import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModalsState } from '../ModalsStateContext';

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
            <Button colorScheme='highlightColor' size="md" mt="2" onClick={openPublishModal}>Publish</Button>
        </div>
    )
}

export default LinkPublish