import React from 'react';
import { Panel } from 'reactflow';
import { Button, IconButton, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

import '../layoutEditorButtons/layout-editor-buttons.css';
import LayoutMenu from '../../layoutCommon/layoutMenu/LayoutMenu';

const LayoutEditorButtons = ({ onSave, onAdd, audiobookTitle, nodes, edges, rfInstance, selectedNodes, onLayout, setNodes, setEdges, fitView }) => {

    return (
        <div className="layout-editor-buttons-container">
            <Panel className="layout-editor-buttons buttons-left" position="top-left">
                <LayoutMenu audiobookTitle={audiobookTitle} nodes={nodes} edges={edges} rfInstance={rfInstance} selectedNodes={selectedNodes} />
                <Button className="logo-button-container" colorScheme="darkButtons" borderRadius={'2px'} size="sm">
                    <Link to="/">
                        <div>
                            <img src={process.env.PUBLIC_URL + '/graphics/Earcade-Logo.png'} alt="Earcade Logo" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </Link>
                </Button>
                <Button size='sm' borderRadius={'2px'} colorScheme='darkButtons' onClick={onSave}>Save</Button>
                <Button size='sm' borderRadius={'2px'} colorScheme='darkButtons' onClick={() => onLayout(nodes, edges, setNodes, setEdges, fitView, 'TB')}>Sort</Button>
            </Panel>

            <Panel className="layout-editor-buttons buttons-center" position="top-center">
                <Button size='sm' borderRadius={'5px'} colorScheme='choiceColor' onClick={() => onAdd('muChoi')}>Choice</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='bridgeColor' onClick={() => onAdd('bridgeNode')}>Bridge</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='timeColor' onClick={() => onAdd('timeNode')}>Time</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='muansColor' onClick={() => onAdd('muAns')}>Multiple</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='reactColor' onClick={() => onAdd('reactNode')}>Reaction</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='inputColor' onClick={() => onAdd('inputNode')}>Input</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='endColor' onClick={() => onAdd('endNode')}>End</Button>
            </Panel>

            <Panel className="buttons-right" position='top-right'>
                <Tooltip bg='darkButtons' label="Need help Editing? Get information about the Nodes or check out the Tutorials!" placement="left">
                    <Link to="/tutorials">
                        <IconButton colorScheme='darkButtons' boxSize={10} aria-label='Help Editor' icon={<QuestionOutlineIcon />} />
                    </Link>
                </Tooltip>
            </Panel>
        </div>
    );
}

export default LayoutEditorButtons;
