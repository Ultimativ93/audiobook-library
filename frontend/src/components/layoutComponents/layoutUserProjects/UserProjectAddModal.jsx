import React, { useEffect, useState } from 'react'
import { Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { v4 as uuid4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import { handleInputChange } from '../layoutAudiobookSetup/LayoutSetupFunctions';
import { handleUploadDetails } from '../../tasks/setupTasks/FetchDetails';

const UserProjectAddModal = ({ isModalAddOpen, setIsModalAddOpen }) => {
    const [newAudiobook, setNewAudiobook] = useState();
    const navigate = useNavigate();

    const handleCreateAudioBook = () => {
        const audiobookFormat = {
            title: '',
            description: '',
            author: '',
            contributors: [],
            category: '',
            inputSelections: {
                mouse: false,
                touch: false,
                speak: false,
                keyboard: false,
                touchKeyboard: false,
                shake: false
            },
            id: uuid4(),
        }
        setNewAudiobook(audiobookFormat);
    }

    useEffect(() => {
        handleCreateAudioBook();
    }, [])

    return (
        <>
            {newAudiobook && (
                <Modal isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create New Project</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            Set the name of your Project
                            <Input
                                placeholder='Audiobook Title ..'
                                size='md'
                                width='300px'
                                value={newAudiobook.title}
                                onChange={(e) => handleInputChange(e.target.value, 'title', newAudiobook, setNewAudiobook)}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' onClick={() => {
                                const detailsSaved = handleUploadDetails(newAudiobook);
                                if (detailsSaved) {
                                    navigate('/editor', { state: { audiobookTitle: newAudiobook.title, new: true } })
                                }
                            }}>
                                Start Editing
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}

export default UserProjectAddModal