import React, { useState } from 'react'
import { Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

import LayoutMenuModalSetup from './layoutMenuModals/LayoutMenuModalSetup';
import LayoutMenuModalUpload from './layoutMenuModals/LayoutMenuModalUpload';
import LayoutMenuModalPreview from './layoutMenuModals/layoutMenuModalPreview/LayoutMenuModalPreview';

const LayoutMenu = ({ audiobookTitle }) => {
    const [modalsState, setModalsState] = useState({
        isSetupModalOpen: false,
        isUploadModalOpen: false,
        isPreviewModalOpen: false,
    });

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
                    Upload Audio
                </MenuItem>

                <MenuItem onClick={() => toggleModal('isSetupModalOpen')}>
                    Setup
                </MenuItem>

                <MenuItem onClick={() => toggleModal('isPreviewModalOpen')}>
                    Preview
                </MenuItem>

                <MenuItem style={{backgroundColor: 'grey'}}>
                    <Link to="/player">Player</Link>
                </MenuItem>

                <MenuItem style={{backgroundColor: 'grey'}}>
                    <Link to={`/editor/${audiobookTitle}`}>Editor</Link>
                </MenuItem>

                <MenuItem style={{backgroundColor: 'grey'}}>
                    <Link to="/user-projects">Projects</Link>
                </MenuItem>
            </MenuList>

            <LayoutMenuModalSetup isModalSetupOpen={modalsState.isSetupModalOpen} setModalsState={() => toggleModal('isSetupModalOpen')} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalUpload isModalUploadOpen={modalsState.isUploadModalOpen} setModalsState={() => toggleModal('isUploadModalOpen')} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalPreview isPreviewModalOpen={modalsState.isPreviewModalOpen} setModalsState={() => toggleModal('isPreviewModalOpen')} audiobookTitle={audiobookTitle} />
        </Menu>
    )
}

export default LayoutMenu;
