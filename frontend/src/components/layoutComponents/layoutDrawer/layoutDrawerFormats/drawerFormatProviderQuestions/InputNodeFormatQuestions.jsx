import React from 'react';
import { DrawerBody } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectRepeatQuestionAudio from '../../drawerComponents/SelectRepeatQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectCorrectAnswer from '../../drawerComponents/SelectCorrectAnswer';
import LinkUpload from '../../drawerComponents/LinkUpload';

// "InputNodeFormatQuestions.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the components used for the questions tab of the drawer for an Input node.
// It is a child of "DrawerFormatProviderQuestion" component.
const InputNodeFormatQuestions = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
  return (
    <>
      <DrawerBody>
        <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
        <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
        <SelectRepeatQuestionAudio nodeData={nodeData} setNodes={setNodes} />
        <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
        <SelectCorrectAnswer nodeData={nodeData} setNodes={setNodes} />
        <LinkUpload />
      </DrawerBody>
    </>
  )
}

export default InputNodeFormatQuestions