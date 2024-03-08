import React from 'react'
import { Switch } from '@chakra-ui/react';

import './drawer-components.css';

import { updateNodeProperty } from '../LayoutDrawerFunctions';

const SelectRepeatQuestionAudio = ({ nodeData, setNodes }) => {
    const isRepeatQuestion = nodeData.data.repeatQuestionAudio === 'true';

    const handleRepeatQuestionChange = (event) => {
        const newRepeatQuestion = event.target.checked;
        updateNodeProperty(setNodes, nodeData, 'repeatQuestionAudio', `${newRepeatQuestion}`);
    };

    return (
        <div className="repeat-question-audio-container">
            <h4>Repeat Question Process</h4>
            <Switch
                defaultChecked={isRepeatQuestion}
                onChange={handleRepeatQuestionChange}
                colorScheme='darkButtons'
            />
        </div>
    )
}

export default SelectRepeatQuestionAudio
