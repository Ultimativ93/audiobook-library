import React from 'react';
import { Panel } from 'reactflow';
import { Button } from '@chakra-ui/react';

import '../layoutEditorButtons/layout-editor-buttons.css';
import LayoutMenu from '../../layoutCommon/layoutMenu/LayoutMenu';

const LayoutEditorButtons = ({ onSave, onAdd, audiobookTitle, nodes, edges, rfInstance, selectedNodes, onLayout, setNodes, setEdges, fitView }) => {

    return (
        <>


            <Panel position="top-left">
                <LayoutMenu audiobookTitle={audiobookTitle} nodes={nodes} edges={edges} rfInstance={rfInstance} selectedNodes={selectedNodes} />
            </Panel>

            <Panel className="layout-editor-buttons" position="top-center">
                <Button size='sm' borderRadius={'5px'} colorScheme='choiceColor' onClick={() => onAdd('muChoi')}>Choice</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='bridgeColor' onClick={() => onAdd('bridgeNode')}>Bridge</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='timeColor' onClick={() => onAdd('timeNode')}>Time</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='muansColor' onClick={() => onAdd('muAns')}>Multiple</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='reactColor' onClick={() => onAdd('reactNode')}>Reaction</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='inputColor' onClick={() => onAdd('inputNode')}>Input</Button>
                <Button size='sm' borderRadius={'5px'} colorScheme='endColor' onClick={() => onAdd('endNode')}>End</Button>
            </Panel>
            <Panel className="layout-editor-buttons" position="top-right">
                <Button size='sm' borderRadius={'2px'} colorScheme='darkButtons' onClick={onSave}>Save</Button>
                <Button size='sm' borderRadius={'2px'} colorScheme='darkButtons' onClick={() => onLayout(nodes, edges, setNodes, setEdges, fitView, 'TB')}>Sort</Button>
            </Panel>
        </>



    );
}

export default LayoutEditorButtons;
