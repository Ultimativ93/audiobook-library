import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from 'reactflow';
import { Button } from '@chakra-ui/react';

import '../layoutLinks/layout-links.css';

const LayoutLinks = ({ audiobookTitle }) => {
  return (
    <Panel className='layout-links' position='top-right'>

      <Button colorScheme='orange' size='sm'>
        <Link to={`/data-upload/${audiobookTitle}`}>Upload Audio</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to="/player">Player</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to={`/editor/${audiobookTitle}`}>Editor</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to="/audiobook-setup">Setup</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to="/user-projects">Projects</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to="/">Home</Link>
      </Button>
    </Panel>
  );
};

export default LayoutLinks;
