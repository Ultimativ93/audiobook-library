import React from 'react';
import { Button } from '@chakra-ui/react';
import { useModalsState } from '../ModalsStateContext';

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
            <Button colorScheme='blue' size="sm" mt="2" onClick={openSetupModal}>Edit Setup</Button>
        </div>
    )
}

export default LinkSetup