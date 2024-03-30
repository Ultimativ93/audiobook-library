import React, { useState, useEffect } from 'react'
import { Textarea } from '@chakra-ui/react';

import { updateNodeProperty } from '../../../tasks/drawerTasks/LayoutDrawerFunctions';

// "SetNote.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It updates the node property of note. The note for the node.
// It is a child of "BridgeNodeFormatGeneral", "EndNodeFormatGeneral", "InputNodeFormatGeneral", "MuAnsFormatGeneral",
// "MuChoiFormatGeneral", "ReactNodeFormatGeneral" and the "TimeNodeFormatGeneral" component.
const SetNote = ({ nodeData, setNodes }) => {
    const [note, setNote] = useState(nodeData.data.note || '');

    useEffect(() => {
        setNote(nodeData.data.note);
    }, [nodeData]);

    return (
        <div className='note-container'>
            <h4>Set Notes</h4>
            <Textarea
                placeholder='Note ..'
                size='md'
                width='100%'
                value={note}
                onChange={(e) => {
                    setNote(e.target.value);
                    updateNodeProperty(setNodes, nodeData, 'note', e.target.value);
                }}
                resize='vertical'
                focusBorderColor='darkButtons'
                marginBottom='15px'
            />
        </div>
    )
}

export default SetNote