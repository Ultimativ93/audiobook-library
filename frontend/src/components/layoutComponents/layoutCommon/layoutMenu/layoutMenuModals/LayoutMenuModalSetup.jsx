import React, { useState, useEffect } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';

import ExistingAudiobookSetup from '../../../../../views/audioBookSetup/existingAudiobookSetup/ExistingAudiobookSetup';
import { handleGetDetails } from '../../../../tasks/setupTasks/FetchDetails';

//"LayoutMenuModalSetup.jsx" component is accessed by the "Editor" view. It handles the information like long description, thumbnail, author, input selections,
//contributors and category of an audiobook.
// Is a child of "LayoutEditorButtons" component
const LayoutMenuModalSetup = ({ isModalSetupOpen, setModalsState, audiobookTitle }) => {
    const [existingAudiobookDetails, setExistingAudiobookDetails] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if (audiobookTitle !== 'null' && audiobookTitle !== undefined) {
                try {
                    const details = await handleGetDetails(audiobookTitle);
                    setExistingAudiobookDetails(details);
                } catch (error) {
                    console.error('Error fetching audiobook details:', error);
                }
            }
        }

        fetchData();
    }, []);

    return (
        <Modal isOpen={isModalSetupOpen} onClose={() => setModalsState(prevState => ({ ...prevState, isSetupModalOpen: false }))} size='5xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Setup Audiobook</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ExistingAudiobookSetup existingAudiobookDetails={existingAudiobookDetails} setExistingAudiobookDetails={setExistingAudiobookDetails} setModalsState={setModalsState} audiobookTitle={audiobookTitle} />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default LayoutMenuModalSetup;
