import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from 'reactflow';
import { Button } from '@chakra-ui/react';

import '../layoutLinks/layout-links.css';

const LayoutLinks = () => {
  return (
    <Panel className='layout-links' position='top-right'>

      <Button colorScheme='orange' size='sm'>
        <Link to="/data-upload" style={{ margin: 5 }}>Upload Audio</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to="/player" style={{ margin: 5 }}>Player</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to="/" style={{ margin: 5 }}>Editor</Link>
      </Button>

      <Button colorScheme='orange' size='sm'>
        <Link to="/audiobook-setup" style={{ margin: 5 }}>Setup</Link>
      </Button>

    </Panel>
  );
};

export default LayoutLinks;
