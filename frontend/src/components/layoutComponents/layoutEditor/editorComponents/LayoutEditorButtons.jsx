import React from 'react'
import { Panel } from 'reactflow';

const LayoutEditorButtons = ({ onSave, onRestore, onAdd }) => {
    return (
        <Panel position="top-left">
            <button onClick={onSave} style={{ margin: 5 }}>Save</button>
            <button onClick={onRestore} style={{ margin: 5 }}>Restore</button>
            <button onClick={() => onAdd('muChoi')} style={{ margin: 5 }}>MuChoi</button>
            <button onClick={() => onAdd('endNode')} style={{ margin: 5 }}>End</button>
            <button onClick={() => onAdd('bridgeNode')} style={{ margin: 5 }}>Bridge</button>
            <button onClick={() => onAdd('timeNode')} style={{ margin: 5 }}>Time</button>
            <button onClick={() => onAdd('muAns')} style={{ margin: 5 }}>MuAns</button>
        </Panel>
    )
}

export default LayoutEditorButtons