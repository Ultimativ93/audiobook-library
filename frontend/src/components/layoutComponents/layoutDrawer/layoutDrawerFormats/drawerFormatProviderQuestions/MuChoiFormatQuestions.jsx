import React from 'react'
import { DrawerBody, DrawerFooter, DrawerHeader } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectRepeatQuestionAudio from '../../drawerComponents/SelectRepeatQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectAnswers from '../../drawerComponents/SelectAnswers';

const MuChoiFormatQuestions = ({ nodeData, setNodes, setEdges, edges }) => {

  return (
    <>
      <DrawerHeader>{`Edit Node: ${nodeData.data.label}`}</DrawerHeader>
      <DrawerBody>
        <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
        <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} />
        <SelectRepeatQuestionAudio nodeData={nodeData} setNodes={setNodes} />
        <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
        <SelectAnswers nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges}/>
      </DrawerBody>
      <DrawerFooter>
        {/* */}
      </DrawerFooter>
    </>
  )
}

export default MuChoiFormatQuestions