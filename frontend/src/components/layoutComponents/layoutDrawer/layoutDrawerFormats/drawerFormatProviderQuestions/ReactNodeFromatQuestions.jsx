import React from 'react';
import { DrawerBody } from '@chakra-ui/react';

import SelectQuestion from '../../drawerComponents/SelectQuestion';
import SelectQuestionAudio from '../../drawerComponents/SelectQuestionAudio';
import SelectRepeatQuestionAudio from '../../drawerComponents/SelectRepeatQuestionAudio';
import SelectInputSelections from '../../drawerComponents/SelectInputSelections';
import SelectPeriod from '../../drawerComponents/SelectPeriod';

const ReactNodeFromatQuestions = ({ nodeData, setNodes, setEdges, edges, audiobookTitle }) => {
    return (
        <>
            <DrawerBody>
                <SelectQuestion nodeData={nodeData} setNodes={setNodes} />
                <SelectQuestionAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} />
                <SelectRepeatQuestionAudio nodeData={nodeData} setNodes={setNodes} />
                <SelectInputSelections nodeData={nodeData} setNodes={setNodes} />
                <SelectPeriod nodeData={nodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} />
            </DrawerBody>
        </>
    )
}

export default ReactNodeFromatQuestions