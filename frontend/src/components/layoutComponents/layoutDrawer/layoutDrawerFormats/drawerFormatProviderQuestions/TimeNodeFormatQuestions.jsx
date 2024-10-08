import React from 'react';
import { DrawerBody } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectAnswersTime from '../../drawerComponents/SelectAnswersTime';
import SelectAnswerProcessAudio from '../../drawerComponents/SelectAnswerProcessAudio';
import LinkUpload from '../../drawerComponents/LinkUpload';

// "TimeNodeFormatQuestions.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the components used for the questions tab of the drawer for an Time node.
// It is a child of "DrawerFormatProviderQuestion" component.
const TimeNodeFormatQuestions = ({ nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
    return (
        <>
            <DrawerBody>
                <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
                <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
                <SelectAnswerProcessAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                <SelectAnswersTime nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                <LinkUpload />
            </DrawerBody>
        </>
    )
}

export default TimeNodeFormatQuestions