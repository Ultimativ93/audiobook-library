import React from 'react';
import { Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useModalsState } from '../../layoutCommon/layoutMenu/ModalsStateContext';
import LayoutMenuModalSetup from './layoutMenuModals/LayoutMenuModalSetup';
import LayoutMenuModalUpload from './layoutMenuModals/layoutMenuModalUpload/LayoutMenuModalUpload';
import LayoutMenuModalPreview from './layoutMenuModals/layoutMenuModalPreview/LayoutMenuModalPreview';
import LayoutMenuModalPublish from './layoutMenuModals/layoutMenuModalPublish/LayoutMenuModalPublish';

const LayoutMenu = ({ audiobookTitle, nodes, edges, rfInstance }) => {
    const { modalsState, setModalsState } = useModalsState();

    const toggleModal = (modalName) => {
        setModalsState(prevState => ({
            ...prevState,
            [modalName]: !prevState[modalName]
        }));
    };

    return (
        <Menu>
            <MenuButton as={IconButton} aria-label='Options' icon={<HamburgerIcon />} variant='outline' />
            <MenuList>
                <MenuItem onClick={() => toggleModal('isUploadModalOpen')}>
                    Upload Data
                </MenuItem>
                <MenuItem onClick={() => toggleModal('isSetupModalOpen')}>
                    Setup
                </MenuItem>
                <MenuItem onClick={() => toggleModal('isPreviewModalOpen')}>
                    Preview
                </MenuItem>
                <MenuItem style={{ backgroundColor: 'grey' }}>
                    <Link to="/player">Player</Link>
                </MenuItem>
                <MenuItem style={{ backgroundColor: 'grey' }}>
                    <Link to={`/editor/${audiobookTitle}`}>Editor</Link>
                </MenuItem>
                <MenuItem style={{ backgroundColor: 'grey' }}>
                    <Link to="/user-projects">Projects</Link>
                </MenuItem>
                <MenuItem onClick={() => toggleModal('isPublishModalOpen')}>
                    Publish
                </MenuItem>
            </MenuList>

            <LayoutMenuModalSetup isModalSetupOpen={modalsState.isSetupModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalUpload isModalUploadOpen={modalsState.isUploadModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalPreview isPreviewModalOpen={modalsState.isPreviewModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalPublish isPublishModalOpen={modalsState.isPublishModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} nodes={nodes} edges={edges} rfInstance={rfInstance} />
        </Menu>
    );
};

export default LayoutMenu;