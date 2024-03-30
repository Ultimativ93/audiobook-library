import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Background } from 'reactflow';
import { useParams, useLocation } from 'react-router-dom';
import { saveFlow, restoreFlow, handleCloseDrawer, handleNodesChange, handleFlowClick, colorSelectedNodes, handleNodeChangesAndSave, handleNodeClick, updateDrawer, getLayoutedElements, onLayout } from '../../components/tasks/editorTasks/EditorFunctions';

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

// Editor, main component of the app. Handles creating, saving, restoring of the flow plus the handling of the nodes, has the links for the different modals like "LayoutMenuModalSetup",
// "LayoutMenuModalUpload", "LayoutMenuModalPreview", "LayoutMenuModalPublish" and the buttons to create nodes. Also the drawer component is included and the handling of it. 
const Editor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const { setViewport } = useReactFlow();
    const { fitView } = useReactFlow();
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [isNodeSelected, setIsNodeSelected] = useState(false);
    const [previousNodes, setPreviousNodes] = useState([]);
    const [previousEdges, setPreviousEdges] = useState([]);
    const [fileChange, setFileChange] = useState(false);

    // Get parameters from URL
    const { audiobookTitleParam } = useParams();
    const location = useLocation();
    const newAudiobook = location.state && location.state.new ? location.state.new : false;
    const audiobookTitle = audiobookTitleParam || (location.state && location.state.audiobookTitle);

    // Callback to handle connection between nodes
    const onConnect = useCallback((params) => {
        const { source, target, sourceHandle } = params;
        const isSourceConnected = edges.some(edge => edge.source === source && edge.sourceHandle === sourceHandle);
        if (isSourceConnected) {
            return;
        }

        setEdges((prevEdges) => addEdge(params, prevEdges));
    }, [edges, setEdges]);

    // Callback to save flow
    const onSave = useCallback(() => {
        saveFlow(rfInstance, audiobookTitle, nodes);
    }, [rfInstance, audiobookTitle, nodes]);

    // Callback to restore flow
    const onRestoreCallback = useCallback(() => {
        restoreFlow(audiobookTitle, setNodes, setEdges, setViewport, newAudiobook);
    }, [audiobookTitle, setNodes, setEdges, setViewport, newAudiobook]);

    // Callback to add a new node
    const onAdd = useCallback((nodeType) => {
        const lastNodeId = nodes.length > 0 ? nodes[nodes.length - 1].id : 0;
        const newNode = NodeTypesDataFormat(nodeType, lastNodeId, nodes);
        setNodes((prevNodes) => prevNodes.concat(newNode));
    }, [setNodes, nodes.length]);

    // useEffect to restore flow on component mount
    useEffect(() => {
        if (newAudiobook) {
            onSave();
        }
        if (audiobookTitle && audiobookTitle !== 'undefined') {
            onRestoreCallback();
        }
    }, [audiobookTitle, onRestoreCallback, newAudiobook]);

    // Callback for handleSelectionChange,
    const handleSelectionChangeCallback = useCallback((selectedNodeIds) => {
        let ids = [];
        if (Array.isArray(selectedNodeIds)) {
            ids = selectedNodeIds;
        } else if (selectedNodeIds && Array.isArray(selectedNodeIds.nodes)) {
            ids = selectedNodeIds.nodes.map(node => node.id);
        } else {
            console.error('selectedNodeIds is not in the expected format:', selectedNodeIds);
        }
        setSelectedNodes(ids);
        setIsNodeSelected(ids.length > 0);
        colorSelectedNodes(ids);

        if (ids.includes('1')) {
            handleCloseDrawer(setIsDrawerOpen, setSelectedNodeData, selectedNodeData);
        }
    }, []);

    // useEffect to handle color changes of selected nodes
    useEffect(() => {
        if (isNodeSelected) {
            const changeColors = colorSelectedNodes(selectedNodes);
            changeColors();
        }
    }, [selectedNodes, isNodeSelected]);

    // useEffect to handle Node Changes an save if changed nodes/edges
    useEffect(() => {
        handleNodeChangesAndSave(nodes, edges, previousNodes, previousEdges, onSave);
        setPreviousNodes(nodes);
        setPreviousEdges(edges);
    }, [nodes, edges, previousNodes, previousEdges]);

    // Updates Nodes in Drawer
    useEffect(() => {
        if (selectedNodes.length > 0) {
            const selectedNodeId = selectedNodes[0];
            const selectedNode = nodes.find(node => node.id === selectedNodeId);
            if (selectedNode) {
                setSelectedNodeData(selectedNode);
            } 
        }
    }, [nodes, selectedNodes]);


    // Handling that the Editor will not be cut off by "overflow: hidden" in the Header.jsx component.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [audiobookTitleParam])

    return (
        <div className='editor-wrapper'>
                <LayoutEditorDrawer isOpen={isDrawerOpen} onClose={() => handleCloseDrawer(setIsDrawerOpen, setSelectedNodeData, selectedNodes)} nodeData={selectedNodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} fileChange={fileChange} setFileChange={setFileChange} />
                <LayoutEditorButtons onSave={onSave} onAdd={onAdd} audiobookTitle={audiobookTitle} nodes={nodes} edges={edges} rfInstance={rfInstance} selectedNodes={selectedNodes} onLayout={onLayout} setNodes={setNodes} setEdges={setEdges} fitView={fitView} fileChange={fileChange} setFileChange={setFileChange} />

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange(nodes, onNodesChange, handleCloseDrawer, setIsDrawerOpen, setSelectedNodeData, selectedNodes)}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setRfInstance}
                    nodeTypes={nodeTypes}
                    onNodeClick={(event, node) => handleNodeClick(event, node, setIsDrawerOpen, setSelectedNodeData, isDrawerOpen, setSelectedNodes)}
                    onSelectionChange={handleSelectionChangeCallback}
                    onClick={(event) => handleFlowClick(event, handleCloseDrawer, setSelectedNodeData, setIsDrawerOpen, selectedNodes, setSelectedNodes)}
                    fitView
                    className='editor-flow'
                >
                    <Background />
                </ReactFlow>
        </div>
    );
};

export default Editor;
