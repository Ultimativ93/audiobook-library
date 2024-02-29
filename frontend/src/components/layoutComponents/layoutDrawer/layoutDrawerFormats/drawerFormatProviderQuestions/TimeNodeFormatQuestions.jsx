import React from 'react';
import { DrawerBody } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectAnswersTime from '../../drawerComponents/SelectAnswersTime';
import SelectAnswerProcessAudio from '../../drawerComponents/SelectAnswerProcessAudio';
import LinkUpload from '../../drawerComponents/LinkUpload';

const TimeNodeFormatQuestions = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {

    return (
        <>
            <DrawerBody>
                <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
                <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
                <SelectAnswerProcessAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle}/>
                <SelectAnswersTime nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} />
                <LinkUpload />
            </DrawerBody>
        </>
    )
}

export default TimeNodeFormatQuestions