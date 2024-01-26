import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from 'reactflow';

const LayoutEditorLinks = () => {
    return (
        <Panel position='top-right'>
            <Link to="/data-upload" style={{ margin: 5 }}>Upload Audio</Link>
            <Link to="/player" style={{ margin: 5 }}>Player</Link>
        </Panel>
    )
}

export default LayoutEditorLinks