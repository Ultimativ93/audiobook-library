import React, { useState } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    Panel,
    Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import MultipleChoiceNode from '../components/nodeTypes/MultipleChoiceNode';
import LayoutDrawer from '../components/layoutComponents/LayoutDrawer';
import NodeTypesDataFormat from '../components/nodeTypes/nodeTypesDataFormat/NodeTypesDataFormat';

const flowKey = 'first-flow';

const nodeTypes = {
    muChoi: MultipleChoiceNode,
};



const Editor = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const [ids, setIds] = useState(0); // Neuer Hook für die IDs

    console.log(nodes)
    console.log('nodes')

    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
    
    const onSave = () => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    };

    const onRestore = () => {
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
    };

    const onAdd = () => {
        const newNode = NodeTypesDataFormat('muChoi', ids, setIds); // Übergebe IDs und setIds an die Funktion
        console.log(newNode);
        console.log('newNode');
        setNodes((nds) => nds.concat(newNode));
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const onOpenDrawer = (node) => {
        setSelectedNodeData(node);
        setIsDrawerOpen(true);
    };

    const updateNodeLabel = (nodeId, newLabel) => {
        setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            });
        });
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
                <LayoutDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} nodeData={selectedNodeData} updateNodeLabel={updateNodeLabel} />
            </Panel>
            <Panel position="top-left">
                <button onClick={onAdd} style={{ margin: 10 }}>Add Node</button>
                <button onClick={onSave} style={{ margin: 10 }}>Save</button>
                <button onClick={onRestore} style={{ margin: 10 }}>Restore</button>
            </Panel>
            <Background />
        </ReactFlow>
    );
};

export default Editor;
