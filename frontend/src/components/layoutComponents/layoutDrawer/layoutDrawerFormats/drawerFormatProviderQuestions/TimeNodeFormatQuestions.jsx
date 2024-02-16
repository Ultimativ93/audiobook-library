import React from 'react';
import { DrawerBody, DrawerHeader } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectRepeatQuestionAudio from '../../drawerComponents/SelectRepeatQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectAnswersTime from '../../drawerComponents/SelectAnswersTime';

const TimeNodeFormatQuestions = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {

    return (
        <>
            <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
            <DrawerBody>
                <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
                <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SelectRepeatQuestionAudio nodeData={nodeData} setNodes={setNodes} />
                <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
                <SelectAnswersTime nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} />
            </DrawerBody>
        </>
    )
}

export default TimeNodeFormatQuestions