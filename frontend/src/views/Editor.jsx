import React, { useState, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Background } from 'reactflow';
import axios from 'axios';
import 'reactflow/dist/style.css';

import LayoutEditorDrawer from '../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorDrawer';
import LayoutEditorButtons from '../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorButtons';
import LayoutEditorLinks from '../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorLinks';

import NodeTypesDataFormat from '../components/nodeTypes/nodeTypesDataFormat/NodeTypesDataFormat';
import MultipleChoiceNode from '../components/nodeTypes/multipleChoiceNode/MultipleChoiceNode';
import EndNode from '../components/nodeTypes/endNode/EndNode';
import BridgeNode from '../components/nodeTypes/bridgeNode/BridgeNode';
import TimeNode from '../components/nodeTypes/timeNode/TimeNode';
import MultipleAnswerNode from '../components/nodeTypes/multipleAnswerNode/MultipleAnswerNode';
import ReactionNode from '../components/nodeTypes/reactionNode/ReactionNode';
import InputNode from '../components/nodeTypes/inputNode/InputNode';
import DialogNode from '../components/nodeTypes/dialogNode/DialogNode';

import useStore from '../components/tasks/store';

// We will change this later to user id + label of audiobook
const flowKey = 'First-trys';

// Object defining custom nodes for react-flow
const nodeTypes = {
    muChoi: MultipleChoiceNode,
    endNode: EndNode,
    bridgeNode: BridgeNode,
    timeNode: TimeNode,
    muAns: MultipleAnswerNode,
    reactNode: ReactionNode,
    inputNode: InputNode,
    dialogNode: DialogNode,
};

// Array with initial nodes
const initialNodes = [
    { id: '1', data: { label: 'Start' }, position: { x: 100, y: 100 } },
];

// Array with initial edges
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const Editor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const { setViewport } = useReactFlow();

    // Function to handle node connections by updating the edges state
    const onConnect = useCallback((params) => {
        setEdges((prevEdges) => addEdge(params, prevEdges));
    }, [setEdges]);

    // Function to handle saving nodes into the database which is located in the backend
    const onSave = useCallback(async () => {
        if (rfInstance) {
            const flow = rfInstance.toObject();

            try {
                const response = await axios.post('http://localhost:3005/saveFlow', {
                    flow,
                    flowKey: flowKey, // or whatever is the correct flowKey
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
            const response = await axios.get(`http://localhost:3005/getFlow?flowKey=${flowKey}`);

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

    // Function to add a new node to the viewport based on the specified node type
    const onAdd = useCallback((nodeType) => {
        console.log("NodeType Editor:", nodeType)
        const lastNodeId = nodes.length > 0 ? nodes[nodes.length - 1].id : 0;
        const newNode = NodeTypesDataFormat(nodeType, lastNodeId);
        setNodes((prevNodes) => prevNodes.concat(newNode));
    }, [setNodes, nodes.length]);

    // Function to set the selected node and open the drawer with the selected node
    const onOpenDrawer = (node) => {
        setSelectedNodeData(node);
        setIsDrawerOpen(true);
    };

    return (
        <>
            <LayoutEditorDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} nodeData={selectedNodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} />
            <LayoutEditorButtons onSave={onSave} onRestore={onRestore} onAdd={onAdd} />
            <LayoutEditorLinks />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                onNodeClick={(event, node) => { onOpenDrawer(node) }}
            >
                 
                <Background />
            </ReactFlow>
        </>
    );
};

export default Editor;
