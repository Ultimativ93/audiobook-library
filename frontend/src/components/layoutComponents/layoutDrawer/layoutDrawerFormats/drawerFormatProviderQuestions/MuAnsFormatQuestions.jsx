import React from 'react';
import { DrawerBody } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectRepeatQuestionAudio from '../../drawerComponents/SelectRepeatQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectAnswers from '../../drawerComponents/SelectAnswers';
import LinkUpload from '../../drawerComponents/LinkUpload';

const MuAnsFormatQuestions = ({ nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
    return (
        <>
            <DrawerBody>
                <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
                <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange}/>
                <SelectRepeatQuestionAudio nodeData={nodeData} setNodes={setNodes} />
                <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
                <SelectAnswers nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange}/>
                <LinkUpload />
            </DrawerBody>
        </>
    )
}

export default MuAnsFormatQuestions