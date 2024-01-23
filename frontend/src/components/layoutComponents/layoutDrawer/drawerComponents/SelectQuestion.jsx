import React from 'react'
import { Input } from '@chakra-ui/react';

import { updateQuestion } from '../LayoutDrawerFunctions';

const SelectQuestion = ({ nodeData, setNodes }) => {
    return (
        <>
            <h4>Set Question</h4>
            <Input
                placeholder='Question ..'
                defaultValue={nodeData.data.question}
                onChange={(event) => updateQuestion(setNodes, nodeData, event)}
            />
        </>
    )
}

export default SelectQuestion

