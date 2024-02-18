import axios from 'axios';

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

export const restoreFlow = async (audiobookTitle, setNodes, setEdges, setViewport, newAudiobook, onRestore) => {
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

export const handleNodeClick = (event, node, setIsDrawerOpen, setSelectedNodeData) => {
    if (event.ctrlKey) {
        return;
    }

    if (node.id === '1' && node.data.label === 'Start') return; // Don't open drawer for start node
    setIsDrawerOpen(true);
    setSelectedNodeData(node);
};

export const handleCloseDrawer = (setIsDrawerOpen, setSelectedNodeData) => {
    setIsDrawerOpen(false);
    setSelectedNodeData(null);
};

export const handleNodesChange = (nodes, onNodesChange) => (changes) => {
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

export const handleFlowClick = (event, handleCloseDrawer) => {
    if (!event.target.closest('.react-flow__node')) {
        handleCloseDrawer();
    }
};

export const handleSelectionChange = (selectedNodes, setSelectedNodes) => (selectedNodeIds) => {
    let ids = [];
    if (Array.isArray(selectedNodeIds)) {
        ids = selectedNodeIds;
    } else if (selectedNodeIds && Array.isArray(selectedNodeIds.nodes)) {
        ids = selectedNodeIds.nodes.map(node => node.id);
    } else {
        console.error('selectedNodeIds is not in the expected format:', selectedNodeIds);
    }
    setSelectedNodes(ids);
};

export const colorSelectedNodes = (selectedNodes) => () => {
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
};
