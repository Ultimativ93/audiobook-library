import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Background } from 'reactflow';
import { useParams, useLocation } from 'react-router-dom';

import LayoutEditorDrawer from '../../components/layoutComponents/layoutEditor/LayoutEditorDrawer';
import LayoutEditorButtons from '../../components/layoutComponents/layoutEditor/layoutEditorButtons/LayoutEditorButtons';
import NodeTypesDataFormat from '../../components/nodeTypes/NodeTypesDataFormat';

import MultipleChoiceNode from '../../components/nodeTypes/multipleChoiceNode/MultipleChoiceNode';
import EndNode from '../../components/nodeTypes/endNode/EndNode';
import BridgeNode from '../../components/nodeTypes/bridgeNode/BridgeNode';
import TimeNode from '../../components/nodeTypes/timeNode/TimeNode';
import MultipleAnswerNode from '../../components/nodeTypes/multipleAnswerNode/MultipleAnswerNode';
import ReactionNode from '../../components/nodeTypes/reactionNode/ReactionNode';
import InputNode from '../../components/nodeTypes/inputNode/InputNode';

import {
    saveFlow,
    restoreFlow,
    handleNodeClick,
    handleCloseDrawer,
    handleNodesChange,
    handleFlowClick,
    handleSelectionChange,
    colorSelectedNodes,
} from '../../components/tasks/editorTasks/EditorFunctions';

import 'reactflow/dist/style.css';
import '../editor/editor.css'

// Define node types
const nodeTypes = {
    muChoi: MultipleChoiceNode,
    endNode: EndNode,
    bridgeNode: BridgeNode,
    timeNode: TimeNode,
    muAns: MultipleAnswerNode,
    reactNode: ReactionNode,
    inputNode: InputNode,
};

// Initial nodes and edges
const initialNodes = [
    { id: '1', data: { label: 'Start', isDeletable: false, isStart: 'true' }, position: { x: 100, y: 100 }, },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const Editor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const { setViewport } = useReactFlow();
    const [selectedNodes, setSelectedNodes] = useState([]);

    // Get parameters from URL
    const { audiobookTitleParam } = useParams();
    const location = useLocation();
    const newAudiobook = location.state && location.state.new ? location.state.new : false;
    const audiobookTitle = audiobookTitleParam || (location.state && location.state.audiobookTitle);

    // Callback to handle connection between nodes
    const onConnect = useCallback((params) => {
        setEdges((prevEdges) => addEdge(params, prevEdges));
    }, [setEdges]);

    // Callback to save flow
    const onSave = useCallback(() => {
        saveFlow(rfInstance, audiobookTitle);
    }, [rfInstance, audiobookTitle]);

    // Callback to restore flow
    const onRestoreCallback = useCallback(() => {
        restoreFlow(audiobookTitle, setNodes, setEdges, setViewport, newAudiobook, onRestoreCallback);
    }, [audiobookTitle, setNodes, setEdges, setViewport, newAudiobook]);

    // Callback to add a new node
    const onAdd = useCallback((nodeType) => {
        const lastNodeId = nodes.length > 0 ? nodes[nodes.length - 1].id : 0;
        const newNode = NodeTypesDataFormat(nodeType, lastNodeId);
        setNodes((prevNodes) => prevNodes.concat(newNode));
    }, [setNodes, nodes.length]);

    // useEffect to restore flow on component mount
    useEffect(() => {
        if (audiobookTitle && audiobookTitle !== 'undefined' && newAudiobook !== true) {
            onRestoreCallback();
        }
    }, [audiobookTitle, onRestoreCallback, newAudiobook]);

    // useEffect to handle color changes of selected nodes
    useEffect(() => {
        colorSelectedNodes(selectedNodes)();
    }, [selectedNodes]);

    return (
        <>
            <LayoutEditorDrawer isOpen={isDrawerOpen} onClose={() => handleCloseDrawer(setIsDrawerOpen, setSelectedNodeData)} nodeData={selectedNodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} />
            <LayoutEditorButtons onSave={onSave} onRestore={onRestoreCallback} onAdd={onAdd} audiobookTitle={audiobookTitle} />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange(nodes, onNodesChange)}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                onNodeClick={(event, node) => handleNodeClick(event, node, setIsDrawerOpen, setSelectedNodeData)}
                onSelectionChange={handleSelectionChange(selectedNodes, setSelectedNodes)}
                className='editor-flow'
                onClick={(event) => handleFlowClick(event, () => handleCloseDrawer(setIsDrawerOpen, setSelectedNodeData))}
            >
                <Background />
            </ReactFlow>
        </>
    );
};

export default Editor;
