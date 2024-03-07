import axios from 'axios';
import isEqual from 'lodash/isEqual';
import Dagre, { layout } from '@dagrejs/dagre';

export const saveFlow = async (rfInstance, audiobookTitle) => {
    if (!rfInstance) return;

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
    localStorage.setItem(audiobookTitle, JSON.stringify(flow));
};

export const restoreFlow = async (audiobookTitle, setNodes, setEdges, setViewport) => {
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
};

export const handleCloseDrawer = (setIsDrawerOpen, setSelectedNodeData, selectedNodes) => {
    setIsDrawerOpen(false);
    setSelectedNodeData(null);
    colorSelectedNodes(selectedNodes)();
};

export const handleNodesChange = (nodes, onNodesChange, handleCloseDrawer, setIsDrawerOpen, setSelectedNodeData, selectedNodes) => (changes) => {
    const nextChanges = changes.reduce((acc, change) => {
        if (change.type === 'remove') {
            const removedNode = nodes.find((node) => node.id === change.id);
            if (removedNode && removedNode.data && removedNode.data.isDeletable === false) {
                return acc;
            }

            if (selectedNodes.includes(change.id)) {
                handleCloseDrawer(setIsDrawerOpen, setSelectedNodeData, selectedNodes);
            }
        }
        return [...acc, change];
    }, []);
    onNodesChange(nextChanges);
};

export const handleFlowClick = (event, handleCloseDrawer, setSelectedNodeData, setIsDrawerOpen, selectedNodes, setSelectedNodes) => {
    if (!event.target.closest('.react-flow__node') && selectedNodes.length > 0) {
        handleCloseDrawer(setIsDrawerOpen, setSelectedNodeData, selectedNodes);
        setSelectedNodeData(null);
        setSelectedNodes([]);
    }
};

export const colorSelectedNodes = (selectedNodes) => {
    const changeNodeColors = () => {
        if (!Array.isArray(selectedNodes)) {
            console.error('selectedNodes is not an array:', selectedNodes);
            return;
        }

        const nodesElement = document.querySelectorAll('.react-flow__node');
        nodesElement.forEach(nodeElement => {
            const nodeId = nodeElement.dataset.id;
            const isSelected = selectedNodes.includes(nodeId);
            nodeElement.style.setProperty('--node-background-color', isSelected ? '#FF5A3D' : 'initial');
        });
    };

    return changeNodeColors;
};

export const hasPositionChanged = (nodes, previousNodes) => {
    return nodes.some(node => {
        const previousNode = previousNodes.find(prevNode => prevNode.id === node.id);
        return previousNode && !isEqual(previousNode.position, node.position);
    });
};

export const handleNodeChangesAndSave = (nodes, edges, previousNodes, previousEdges, onSave) => {
    const hasDataChanged = nodes.some(node => {
        const previousNode = previousNodes.find(prevNode => prevNode.id === node.id);
        return previousNode && !isEqual(
            { ...previousNode, position: null },
            { ...node, position: null }
        );
    });

    const hasEdgesChanged = edges.some(edge => {
        const previousEdge = previousEdges.find(prevEdge => prevEdge.id === edge.id);
        return previousEdge && !isEqual(previousEdge, edge);
    });

    if ((hasDataChanged || hasEdgesChanged) && !hasPositionChanged(nodes, previousNodes)) {
        onSave();
    }
};

export const handleNodeClick = (event, node, setIsDrawerOpen, setSelectedNodeData, isDrawerOpen, setSelectedNodes) => {
    if (event.ctrlKey) {
        return;
    }

    if (node.id === '1' && node.data.label === 'Start') return;

    if (!isDrawerOpen) {
        console.log("öffne Drawer")
        setIsDrawerOpen(true);
    }

    setSelectedNodes([node.id]);

    setSelectedNodeData(node);
};

// Function to layout the elements with Dagre
export const getLayoutedElements = (nodes, edges, options) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) => g.setNode(node.id, node));

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const { x, y} = g.node(node.id);

            return { ...node, position: { x, y }};
        }),
        edges,
    };
};

export const onLayout = (nodes, edges, setNodes, setEdges, fitView, direction) => {
    console.log("Layouting");
    const layouted = getLayoutedElements(nodes, edges, { direction });
    
    console.log("nodes in onLayout", nodes);
    
    setNodes(layouted.nodes);
    setEdges(layouted.edges);

    console.log("layoutedNodes", layouted.nodes);
    console.log("layoutedEdges", layouted.edges);
    window.requestAnimationFrame(() => {
        fitView();
    });
};