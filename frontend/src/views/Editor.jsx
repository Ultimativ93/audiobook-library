import React, { useState, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Background } from 'reactflow';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import 'reactflow/dist/style.css';
import './editor/editor.css'

import LayoutEditorDrawer from '../components/layoutComponents/layoutEditor/LayoutEditorDrawer';
import LayoutEditorButtons from '../components/layoutComponents/layoutEditor/layoutEditorButtons/LayoutEditorButtons';
import LayoutLinks from '../components/layoutComponents/layoutCommon/layoutLinks/LayoutLinks';

import NodeTypesDataFormat from '../components/nodeTypes/NodeTypesDataFormat';
import MultipleChoiceNode from '../components/nodeTypes/multipleChoiceNode/MultipleChoiceNode';
import EndNode from '../components/nodeTypes/endNode/EndNode';
import BridgeNode from '../components/nodeTypes/bridgeNode/BridgeNode';
import TimeNode from '../components/nodeTypes/timeNode/TimeNode';
import MultipleAnswerNode from '../components/nodeTypes/multipleAnswerNode/MultipleAnswerNode';
import ReactionNode from '../components/nodeTypes/reactionNode/ReactionNode';
import InputNode from '../components/nodeTypes/inputNode/InputNode';

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
};

// Array with initial nodes
const initialNodes = [
    { id: '1', data: { label: 'Start', isDeletable: false }, position: { x: 100, y: 100 }, style: {width: '120px', backgroundColor: '#9B9B9B', color: '#fff', fontSize: '16px', borderColor: '#ffbd03', borderRadius: '5px', padding: '8px'}},
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

    const location = useLocation();
    const audiobookTitle = location.state?.audiobookTitle;
    console.log("Das ist unser Name aus Details: ", audiobookTitle);

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
                    flowKey: audiobookTitle ,
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
        if (!(node.id === '1')) {
            setSelectedNodeData(node);
            setIsDrawerOpen(true);
        }
        
    };

    // Function to prevent deletion of the start node
    const handleNodesChange = (changes) => {
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
      };

    return (
        <>
            <LayoutEditorDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} nodeData={selectedNodeData} setNodes={setNodes} setEdges={setEdges} edges={edges} />
            <LayoutEditorButtons onSave={onSave} onRestore={onRestore} onAdd={onAdd} />
            <LayoutLinks />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                onNodeClick={(event, node) => { onOpenDrawer(node) }}
                className='editor-flow'
            >

                <Background />
            </ReactFlow>
        </>
    );
};

export default Editor;
