import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Panel } from 'reactflow';

const LayoutLinks = () => {
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1];
  
  return (
    <Panel position='top-right'>
      {(currentPage === 'player' || currentPage === '') && (
        <Link to="/data-upload" style={{ margin: 5 }}>Upload Audio</Link>
      )}
      {(currentPage === '' || currentPage === 'data-upload') && (
        <Link to="/player" style={{ margin: 5 }}>Player</Link>
      )}
      {(currentPage === 'player' || currentPage === 'data-upload') && (
        <Link to="/" style={{ margin: 5 }}>Editor</Link>
      )}
    </Panel>
  );
};

export default LayoutLinks;
