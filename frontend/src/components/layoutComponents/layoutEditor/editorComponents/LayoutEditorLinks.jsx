import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from 'reactflow';

const LayoutLinks = () => {
  return (
    <Panel position='top-right'>

      <Link to="/data-upload" style={{ margin: 5 }}>Upload Audio</Link>
      <Link to="/player" style={{ margin: 5 }}>Player</Link>
      <Link to="/" style={{ margin: 5 }}>Editor</Link>
      <Link to="/audiobook-setup" style={{ margin: 5 }}>Setup</Link>

    </Panel>
  );
};

export default LayoutLinks;
