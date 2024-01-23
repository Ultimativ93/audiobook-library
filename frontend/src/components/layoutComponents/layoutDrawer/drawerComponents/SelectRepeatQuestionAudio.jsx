import React from 'react'
import { Switch } from '@chakra-ui/react';

import { updateRepeatQuestion } from '../LayoutDrawerFunctions';

const SelectRepeatQuestionAudio = ({ nodeData, setNodes }) => {
    const isRepeatQuestion = nodeData.data.repeatQuestionAudio === 'true';

    return (
        <>
            <h4>Repeat Question Audio</h4>
            <Switch
                defaultChecked={isRepeatQuestion}
                onChange={(event) => updateRepeatQuestion(setNodes, nodeData, event)}
            />
        </>
    )
}

export default SelectRepeatQuestionAudio