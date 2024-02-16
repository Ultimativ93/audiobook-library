import React from 'react';
import { DrawerBody, DrawerHeader } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectRepeatQuestionAudio from '../../drawerComponents/SelectRepeatQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectCorrectAnswer from '../../drawerComponents/SelectCorrectAnswer';

const InputNodeFormatQuestions = ({ nodeData, setNodes, audiobookTitle }) => {
  return (
    <>
    <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
    <DrawerBody>
        <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
        <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle}/>
        <SelectRepeatQuestionAudio nodeData={nodeData} setNodes={setNodes} />
        <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
        <SelectCorrectAnswer nodeData={nodeData} setNodes={setNodes} />
    </DrawerBody>
</>
  )
}

export default InputNodeFormatQuestions