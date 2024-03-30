import React from 'react';
import { DrawerBody } from '@chakra-ui/react';

import SelectNodeLabel from '../../drawerComponents/SelectNodeLabel';
import SelectStoryAudio from '../../drawerComponents/SelectStoryAudio';
import SelectInteraktionSignal from '../../drawerComponents/SelectInteractionSignal';
import LinkUpload from '../../drawerComponents/LinkUpload';
import SetNote from '../../drawerComponents/SetNote';

// "MuAnsFormatGeneral.jsx" component, is accessed by the "Editor" view, in the "LayoutDrawer" component.
// It handles the components used for the general tab of the drawer for an Combination/MuAns/MultipleAnswer node.
// Is a child of "DrawerFormatProviderGeneral" component.
const MuAnsFormatGeneral = ({ nodeData, setNodes, audiobookTitle, fileChange, setFileChange }) => {
    return (
        <DrawerBody>
            <SelectNodeLabel nodeData={nodeData} setNodes={setNodes} />
            <SelectStoryAudio nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            <SelectInteraktionSignal nodeData={nodeData} setNodes={setNodes} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
            <SetNote nodeData={nodeData} setNodes={setNodes} />
            <LinkUpload />
        </DrawerBody>
    )
}

export default MuAnsFormatGeneral;