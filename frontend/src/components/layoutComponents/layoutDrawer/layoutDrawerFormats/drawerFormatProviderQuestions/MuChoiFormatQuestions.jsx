import React from 'react'
import { DrawerBody } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectRepeatQuestionAudio from '../../drawerComponents/SelectRepeatQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectAnswers from '../../drawerComponents/SelectAnswers';
import LinkUpload from '../../drawerComponents/LinkUpload';

// "MuChoiFormatQuestions.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the components used for the questions tab of the drawer for an Choice/MuChoi/Multiple Choice node.
// It is a child of "DrawerFormatProviderQuestion" component.
const MuChoiFormatQuestions = ({ nodeData, setNodes, setEdges, edges, audiobookTitle, fileChange, setFileChange }) => {
  return (
    <>
      <DrawerBody>
        <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
        <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
        <SelectRepeatQuestionAudio nodeData={nodeData} setNodes={setNodes} />
        <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
        <SelectAnswers nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
        <LinkUpload />
      </DrawerBody>
    </>
  )
}

export default MuChoiFormatQuestions