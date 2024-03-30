import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { handleDeleteProject } from '../../tasks/projectsTasks/DeleteDetails';

// "UserProjectsDeleteModal.jsx" component, is accessed by the User Projects" view.
// It handles a modal that opens up if a user clicks on delete on a card in "UserProjects" component. It provides a confirmation of the deletion of the project and deletes the project.
// It is a child of "UserProjects" component.
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
                    <Button colorScheme='red' mr={3} leftIcon={<DeleteIcon />} onClick={handleProjectDeletion}>
                        Delete
                    </Button>
                    <Button onClick={() => setIsModalDeleteOpen(false)}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
};

export default UserProjectsDeleteModal;