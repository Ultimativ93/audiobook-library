import React from 'react';
import { Button, IconButton, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

import '../layoutEditorButtons/layout-editor-buttons.css';

import LayoutMenuModalSetup from '../../layoutCommon/layoutMenu/layoutMenuModals/LayoutMenuModalSetup';
import LayoutMenuModalUpload from '../../layoutCommon/layoutMenu/layoutMenuModals/layoutMenuModalUpload/LayoutMenuModalUpload';
import LayoutMenuModalPreview from '../../layoutCommon/layoutMenu/layoutMenuModals/layoutMenuModalPreview/LayoutMenuModalPreview';
import LayoutMenuModalPublish from '../../layoutCommon/layoutMenu/layoutMenuModals/layoutMenuModalPublish/LayoutMenuModalPublish';

import { useModalsState } from '../../layoutCommon/layoutMenu/ModalsStateContext';

const LayoutEditorButtons = ({ onSave, onAdd, audiobookTitle, nodes, edges, rfInstance, selectedNodes, onLayout, setNodes, setEdges, fitView, fileChange, setFileChange }) => {
    const { modalsState, setModalsState } = useModalsState();

    const toggleModal = (modalName) => {
        setModalsState(prevState => ({
            ...prevState,
            [modalName]: !prevState[modalName]
        }));
    };

    return (
        <div className="layout-editor-buttons-container">
            <div className="layout-editor-buttons buttons-left">
                <Button borderRadius={'2px'} colorScheme='darkButtons' onClick={onSave}>Save</Button>
                <Button borderRadius={'2px'} colorScheme='darkButtons' onClick={() => onLayout(nodes, edges, setNodes, setEdges, fitView, 'TB')}>Arrange</Button>
                <Button borderRadius={'2px'} colorScheme='lightButtons' onClick={() => toggleModal('isSetupModalOpen')}>Setup</Button>
                <Button borderRadius={'2px'} colorScheme='lightButtons' onClick={() => toggleModal('isUploadModalOpen')}>Media Manager</Button>
                <Button borderRadius={'2px'} colorScheme='lightButtons' onClick={() => toggleModal('isPreviewModalOpen')}>Preview</Button>
                <Button borderRadius={'2px'} colorScheme='lightButtons' onClick={() => toggleModal('isPublishModalOpen')}>Publish</Button>
            </div>

            <div className="layout-editor-buttons buttons-center">
                <Button size='sm' colorScheme='choiceColor' onClick={() => onAdd('muChoi')}>Choice</Button>
                <Button size='sm' colorScheme='bridgeColor' onClick={() => onAdd('bridgeNode')}>Bridge</Button>
                <Button size='sm' colorScheme='timeColor' onClick={() => onAdd('timeNode')}>Time</Button>
                <Button size='sm' colorScheme='muansColor' onClick={() => onAdd('muAns')}>Multiple</Button>
                <Button size='sm' colorScheme='reactColor' onClick={() => onAdd('reactNode')}>Reaction</Button>
                <Button size='sm' colorScheme='inputColor' onClick={() => onAdd('inputNode')}>Input</Button>
                <Button size='sm' colorScheme='endColor' onClick={() => onAdd('endNode')}>End</Button>
            </div>

            <div className="layout-editor-buttons buttons-right">
                <Tooltip bg='grey' label="Need help Editing? Get information about the Nodes or check out the Tutorials!" placement="left">
                    <Link to="/tutorials">
                        <IconButton colorScheme='darkButtons' boxSize={10} aria-label='Help Editor' icon={<QuestionOutlineIcon />} />
                    </Link>
                </Tooltip>
            </div>

            <LayoutMenuModalSetup isModalSetupOpen={modalsState.isSetupModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} />
            <LayoutMenuModalUpload isModalUploadOpen={modalsState.isUploadModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} nodes={nodes} setNodes={setNodes} setFileChange={setFileChange} />
            <LayoutMenuModalPreview isPreviewModalOpen={modalsState.isPreviewModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} selectedNodes={selectedNodes} />
            <LayoutMenuModalPublish isPublishModalOpen={modalsState.isPublishModalOpen} setModalsState={setModalsState} audiobookTitle={audiobookTitle} nodes={nodes} edges={edges} rfInstance={rfInstance} fileChange={fileChange} setFileChange={setFileChange} />

        </div>
    );
}

export default LayoutEditorButtons;
