import React from 'react'
import { Panel } from 'reactflow';

import LayoutDrawer from '../layoutDrawer/LayoutDrawer';

const LayoutEditorDrawer = ({ isOpen, onClose, nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
    return (
        <Panel position="right">
            <LayoutDrawer isOpen={isOpen} onClose={onClose} nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle}/>
        </Panel>
    )
}

export default LayoutEditorDrawer