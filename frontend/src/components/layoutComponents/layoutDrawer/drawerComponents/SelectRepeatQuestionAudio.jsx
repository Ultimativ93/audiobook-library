import React from 'react'
import { Switch } from '@chakra-ui/react';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectRepeatQuestionAudio = ({ nodeData, setNodes }) => {
    const isRepeatQuestion = nodeData.data.repeatQuestionAudio === 'true';

    const handleRepeatQuestionChange = (event) => {
        const newRepeatQuestion = event.target.checked;
        updateNodeProperty(setNodes, nodeData, 'repeatQuestionAudio', `${newRepeatQuestion}`);
    };

    return (
        <>
            <h4>Repeat Question Audio</h4>
            <Switch
                defaultChecked={isRepeatQuestion}
                onChange={handleRepeatQuestionChange}
            />
        </>
    )
}

export default SelectRepeatQuestionAudio
