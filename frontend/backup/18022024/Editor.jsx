import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Background } from 'reactflow';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

import 'reactflow/dist/style.css';
import '../editor/editor.css'

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

const flowKey = 'First-trys';

const nodeTypes = {
    muChoi: MultipleChoiceNode,
    endNode: EndNode,
    bridgeNode: BridgeNode,
    timeNode: TimeNode,
    muAns: MultipleAnswerNode,
    reactNode: ReactionNode,
    inputNode: InputNode,
};

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

    const { audiobookTitleParam } = useParams();
    const location = useLocation();
    const newAudiobook = location.state && location.state.new ? location.state.new : false;
    const audiobookTitle = audiobookTitleParam || (location.state && location.state.audiobookTitle);

    const onConnect = useCallback((params) => {
        setEdges((prevEdges) => addEdge(params, prevEdges));
    }, [setEdges]);

    const onSave = useCallback(async () => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            try {
                const response = await axios.post('http://localhost:3005/saveFlow', {
                    flow,
                    flowKey: audiobookTitle,
                });
                if (response.status === 200) {
                    console.log('Flow successfully sent to the server.');
                } else {
                    console.error('Error sending flow to the server.');
                }
            } catch (error) {
                console.error('Error in try:', error);
            }
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance, flowKey]);

    const onRestore = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3005/getFlow?flowKey=${audiobookTitle}`);
            if (response.status === 200) {
                const flow = response.data;
                const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            } else {
                console.warn('No flow found in the database');
            }
        } catch (error) {
            console.error('Error restoring flow from the database:', error);
        }
    }, [setNodes, setViewport, setEdges, flowKey]);  

    const handleNodeClick = useCallback((event, node) => {
        if (event.ctrlKey) {
            return;
        }
    
        if (node.id === '1' && node.data.label === 'Start') return; // Don't open drawer for start node
        setIsDrawerOpen(true);
        setSelectedNodeData(node);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        setSelectedNodeData(null);
    }, []);

    const onAdd = useCallback((nodeType) => {
        const lastNodeId = nodes.length > 0 ? nodes[nodes.length - 1].id : 0;
        const newNode = NodeTypesDataFormat(nodeType, lastNodeId);
        setNodes((prevNodes) => prevNodes.concat(newNode));
    }, [setNodes, nodes.length]);

    const handleNodesChange = useCallback((changes) => {
        const nextChanges = changes.reduce((acc, change) => {
            if (change.type === 'remove') {
                const removedNode = nodes.find((node) => node.id === change.id);
                if (removedNode && removedNode.data && removedNode.data.isDeletable === false) {
                    return acc;
                }
            }
            return [...acc, change];
        }, []);
        onNodesChange(nextChanges);
    }, [nodes, onNodesChange]);

    const handleFlowClick = useCallback((event) => {
        if (!event.target.closest('.react-flow__node')) {
            handleCloseDrawer();
        }
    }, [handleCloseDrawer]);

    const handleSelectionChange = useCallback((selectedNodeIds) => {
        let ids = [];
        if (Array.isArray(selectedNodeIds)) {
            ids = selectedNodeIds;
        } else if (selectedNodeIds && Array.isArray(selectedNodeIds.nodes)) {
            ids = selectedNodeIds.nodes.map(node => node.id);
        } else {
            console.error('selectedNodeIds is not in the expected format:', selectedNodeIds);
        }
        setSelectedNodes(ids);
    }, []);

    const colorSelectedNodes = useCallback(() => {
        if (!Array.isArray(selectedNodes)) {
            console.error('selectedNodes is not an array:', selectedNodes);
            return;
        }

        const nodesElement = document.querySelectorAll('.react-flow__node');
        nodesElement.forEach(nodeElement => {
            const nodeId = nodeElement.dataset.id;
            const isSelected = selectedNodes.includes(nodeId);
            nodeElement.style.setProperty('--node-background-color', isSelected ? 'orange' : 'initial');
        });
    }, [selectedNodes]);

    useEffect(() => {
        if (audiobookTitle && audiobookTitle !== 'undefined' && newAudiobook !== true) {
            onRestore();
        }
    }, [audiobookTitle, onRestore, newAudiobook]);

    useEffect(() => {
        colorSelectedNodes();
    }, [selectedNodes, colorSelectedNodes]);

    return (
        <>
            <LayoutEditorDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} nodeData={selectedNodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} audiobookTitle={audiobookTitle} />
            <LayoutEditorButtons onSave={onSave} onRestore={onRestore} onAdd={onAdd} audiobookTitle={audiobookTitle} />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                onSelectionChange={handleSelectionChange}
                className='editor-flow'
                onClick={handleFlowClick} // Close drawer when clicking on empty space
            >
                <Background />
            </ReactFlow>
        </>
    );
};

export default Editor;
