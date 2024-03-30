import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModalsState } from '../ModalsStateContext';

// "LinkSetup.jsx" component, is used for the link for the LayoutMenuModalSetup on the left side of the editor. Can be used later on for linking from other modals.
// Is a child of "LayoutMenuModalUpload"component
const LinkSetup = () => {
    const { setModalsState } = useModalsState();

    const openSetupModal = () => {
        setModalsState(prevState => ({
            ...prevState,
            isSetupModalOpen: true,
        }));
    };

    return (
        <div>
            <Button colorScheme='lightButtons' size='sm' mt='2' onClick={openSetupModal}>Edit Setup</Button>
        </div>
    )
}

export default LinkSetup