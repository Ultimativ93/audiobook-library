import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

import './layout-menu.css';

import { useModalsState } from '../../layoutCommon/layoutMenu/ModalsStateContext';
import LayoutMenuModalSetup from './layoutMenuModals/LayoutMenuModalSetup';
import LayoutMenuModalUpload from './layoutMenuModals/layoutMenuModalUpload/LayoutMenuModalUpload';
import LayoutMenuModalPreview from './layoutMenuModals/layoutMenuModalPreview/LayoutMenuModalPreview';
import LayoutMenuModalPublish from './layoutMenuModals/layoutMenuModalPublish/LayoutMenuModalPublish';

const LayoutMenu = ({ audiobookTitle, nodes, edges, rfInstance, selectedNodes }) => {
    const { modalsState, setModalsState } = useModalsState();

    const toggleModal = (modalName) => {
        setModalsState(prevState => ({
            ...prevState,
            [modalName]: !prevState[modalName]
        }));
    };

    return (
        <>
            <IconButton onClick={() => toggleModal('isMenuModalOpen')} aria-label='Options' icon={<HamburgerIcon />} colorScheme='darkButtons' size="md" />

            <Modal isOpen={modalsState.isMenuModalOpen} onClose={() => toggleModal('isMenuModalOpen')}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Menu</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ul className="menu-list"> 
                            <li>
                                <Button className="menu-item" colorScheme='menuButtons' onClick={() => toggleModal('isSetupModalOpen')} width="100%" bg="white" color="black">
                                    Setup
                                </Button>
                            </li>
                            <hr />
                            <li>
                                <Button className="menu-item" colorScheme='menuButtons' width="100%" bg="white" color="black">
                                    <Link to="/tutorials">Tutorials</Link>
                                </Button>
                            </li>
                            <hr />
                            <li>
                                <Button className="menu-item" colorScheme='menuButtons' onClick={() => toggleModal('isUploadModalOpen')} width="100%" bg="white" color="black">
                                    Upload Data
                                </Button>
                            </li>
                            <hr />
                            <li>
                                <Button className="menu-item" colorScheme='menuButtons' onClick={() => toggleModal('isPreviewModalOpen')} width="100%" bg="white" color="black">
                                    Preview
                                </Button>
                            </li>
                            <hr />
                            <li>
                                <Button className="menu-item" colorScheme='menuButtons' width="100%" bg="white" color="black">
                                    <Link to="/user-projects">Projects</Link>
                                </Button>
                            </li>
                            <hr />
                            <li>
                                <Button className="menu-item" colorScheme='menuButtons' onClick={() => toggleModal('isPublishModalOpen')} width="100%" color="black">
                                    Publish
                                </Button>
                            </li>
                        </ul>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <LayoutMenuModalSetup isModalSetupOpen={modalsState.isSetupModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalUpload isModalUploadOpen={modalsState.isUploadModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalPreview isPreviewModalOpen={modalsState.isPreviewModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} selectedNodes={selectedNodes} />
            <LayoutMenuModalPublish isPublishModalOpen={modalsState.isPublishModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} nodes={nodes} edges={edges} rfInstance={rfInstance} />
        </>
    );
};

export default LayoutMenu;
