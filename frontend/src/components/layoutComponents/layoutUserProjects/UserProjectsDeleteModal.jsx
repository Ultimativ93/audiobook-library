import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { handleDeleteProject } from '../../tasks/projectsTasks/DeleteDetails';

const UserProjectsDeleteModal = ({ isModalDeleteOpen, setIsModalDeleteOpen, selectedProject, reloadDetails }) => {
 
    // Handle Project Deletion
    const handleProjectDeletion = async () => {
        const isDeleted = await handleDeleteProject(selectedProject);
        if (isDeleted) {
            reloadDetails();
        }
        setIsModalDeleteOpen(false); 
    };

    return (
        <Modal isOpen={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to delete this project?
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="red" mr={3} leftIcon={<DeleteIcon />} onClick={handleProjectDeletion}>
                        Delete
                    </Button>
                    <Button onClick={() => setIsModalDeleteOpen(false)}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UserProjectsDeleteModal;