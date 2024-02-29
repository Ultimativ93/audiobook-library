import React from 'react'
import { Panel } from 'reactflow';
import { Button } from '@chakra-ui/react';

import '../layoutEditorButtons/layout-editor-buttons.css';
import LayoutMenu from '../../layoutCommon/layoutMenu/LayoutMenu';

const LayoutEditorButtons = ({ onSave, onRestore, onAdd, audiobookTitle }) => {
    return (
        <Panel className="layout-editor-buttons" position="top-left">
            <LayoutMenu audiobookTitle={audiobookTitle} />
            <Button size='sm' colorScheme='green' onClick={onSave}>Save</Button>
            <Button size='sm' colorScheme='green' onClick={onRestore}>Restore</Button>
            <Button size='sm' colorScheme='linkedin' onClick={() => onAdd('muChoi')}>MuChoi</Button>
            <Button size='sm' colorScheme='linkedin' onClick={() => onAdd('endNode')}>End</Button>
            <Button size='sm' colorScheme='linkedin' onClick={() => onAdd('bridgeNode')}>Bridge</Button>
            <Button size='sm' colorScheme='linkedin' onClick={() => onAdd('timeNode')}>Time</Button>
            <Button size='sm' colorScheme='linkedin' onClick={() => onAdd('muAns')}>MuAns</Button>
            <Button size='sm' colorScheme='linkedin' onClick={() => onAdd('reactNode')}>Reaction</Button>
            <Button size='sm' colorScheme='linkedin' onClick={() => onAdd('inputNode')}>Input</Button>
        </Panel>
    )
}

export default LayoutEditorButtons;