import React, { useState, useEffect } from 'react'
import { Textarea } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

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