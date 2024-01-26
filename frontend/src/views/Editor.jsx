import React, { useState, useCallback } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Background } from 'reactflow';
import 'reactflow/dist/style.css';

import LayoutEditorDrawer from '../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorDrawer';
import LayoutEditorButtons from '../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorButtons';
import LayoutEditorLinks from '../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorLinks';

import NodeTypesDataFormat from '../components/nodeTypes/nodeTypesDataFormat/NodeTypesDataFormat';
import MultipleChoiceNode from '../components/nodeTypes/multipleChoiceNode/MultipleChoiceNode';
import EndNode from '../components/nodeTypes/endNode/EndNode';
import BridgeNode from '../components/nodeTypes/bridgeNode/BridgeNode';

// We will change this later to user id + label of audiobook
const flowKey = 'First-trys';

// Object defining custom nodes for react-flow
const nodeTypes = {
    muChoi: MultipleChoiceNode,
    endNode: EndNode,
    bridgeNode: BridgeNode,
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
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    // Function to handle saving nodes into the database which is located in the backend
    const onSave = useCallback(async () => {
        if (rfInstance) {
            const flow = rfInstance.toObject();

            try {
                const response = await fetch('http://localhost:3005/saveFlow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ flow, flowKey }),
                });
                if (response.ok) {
                    console.log('Flow successfully sent to the server.');
                } else {
                    console.error('Error sending flow to the server.');
                }
            } catch (error) {
                console.error('Error in try:', error);
            }
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance]);


    // Function to restore the flow from local storage
    const onRestore = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3005/getFlow?flowKey=${flowKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                const flow = await response.json();
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
    }, [setNodes, setViewport, setEdges]);
    


    /*
        // Function to restore the flow from local storage
        const onRestore = useCallback(async () => {
            const restoreFlow = async () => {
                const flow = JSON.parse(localStorage.getItem(flowKey));
    
                if (flow) {
                    const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                    setNodes(flow.nodes || []);
                    setEdges(flow.edges || []);
                    setViewport({ x, y, zoom });
                }
            };
            restoreFlow();
        }, [setNodes, setViewport]);
        */

    // Function to add a new node to the viewport based on the specified node type
    const onAdd = useCallback((nodeType) => {
        const newNode = NodeTypesDataFormat(nodeType, nodes.length);
        setNodes((prevNodes) => prevNodes.concat(newNode));
    }, [setNodes, nodes.length]);

    // Function to set the selected node and open the drawer with the selected node
    const onOpenDrawer = (node) => {
        setSelectedNodeData(node);
        setIsDrawerOpen(true);
    };

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            onNodeClick={(event, node) => onOpenDrawer(node)}
        >

            <LayoutEditorDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} nodeData={selectedNodeData} setNodes={setNodes} />
            <LayoutEditorButtons onSave={onSave} onRestore={onRestore} onAdd={onAdd} />
            <LayoutEditorLinks />

            <Background />
        </ReactFlow>
    );
};

export default Editor;