import React from 'react'
import { Menu, MenuButton, IconButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const LayoutMenu = ({ audiobookTitle }) => {
    return (
        <Menu>
            <MenuButton as={IconButton} aria-label='Options' icon={<HamburgerIcon />} variant='outline' />
            <MenuList>
                <MenuItem>
                    <Link to={`/data-upload/${audiobookTitle}`}>Upload Audio</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/player">Player</Link>
                </MenuItem>
                <MenuItem>
                    <Link to={`/editor/${audiobookTitle}`}>Editor</Link>
                </MenuItem>
                <MenuItem>
                    <Link to={`/audiobook-setup/${audiobookTitle}`}>Setup</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/user-projects">Projects</Link>
                </MenuItem>
                <MenuItem>
                    <Link to="/">Home</Link>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default LayoutMenu