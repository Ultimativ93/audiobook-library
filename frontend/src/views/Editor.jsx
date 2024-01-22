import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Panel, Background } from 'reactflow';
import 'reactflow/dist/style.css';

import NodeTypesDataFormat from '../components/nodeTypes/nodeTypesDataFormat/NodeTypesDataFormat';
import MultipleChoiceNode from '../components/nodeTypes/multipleChoiceNode/MultipleChoiceNode';

import LayoutDrawer from '../components/layoutComponents/layoutDrawer/LayoutDrawer';

const flowKey = 'First-trys';

const nodeTypes = {
    muChoi: MultipleChoiceNode,
};

const initialNodes = [
    { id: '1', data: { label: 'Start' }, position: { x: 100, y: 100 } },
    { id: '2', data: { label: 'Node 2' }, nodeType: "muChoi", position: { x: 100, y: 200 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const Editor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const { setViewport } = useReactFlow();

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
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

    const onAdd = useCallback(() => {
        const newNode = NodeTypesDataFormat('muChoi', nodes.length);
        setNodes((prevNodes) => prevNodes.concat(newNode));
    }, [setNodes, nodes.length]);

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
            <Panel position="right">
                <LayoutDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} nodeData={selectedNodeData} setNodes={setNodes}/>
            </Panel>

            <Panel position="top-left">
                <button onClick={onSave} style={{ margin: 5 }}>Save</button>
                <button onClick={onRestore} style={{ margin: 5 }}>Restore</button>
                <button onClick={onAdd} style={{ margin: 5 }}>MuChoi</button>
            </Panel>

            <Panel position='top-right'>
                <Link to="/data-upload">Upload Audio</Link>
            </Panel>

            <Background />
        </ReactFlow>
    );
};

export default Editor;