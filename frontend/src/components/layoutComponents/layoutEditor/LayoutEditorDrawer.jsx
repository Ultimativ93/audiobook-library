import React from 'react';
import { Panel } from 'reactflow';

import LayoutDrawer from '../layoutDrawer/LayoutDrawer';

// "LayoutEditorDrawer.jsx" component, is accessed by the "Editor" view.
// It handles the view of the drawer as a "Panel" component used by reactflow to showcase the drawer.
// It is a child of "Editor" component.
const LayoutEditorDrawer = ({ isOpen, onClose, nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
    console.log('nodeData', nodeData)
    return (
        <Panel position='right'>
            <LayoutDrawer isOpen={isOpen} onClose={onClose} nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
        </Panel>
    )
}

export default LayoutEditorDrawer;
