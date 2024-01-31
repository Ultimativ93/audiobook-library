import { create } from 'zustand';
import { Connection, Edge, EdgeChange, Node, NodeChange, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

const useStore = create((set) => ({
    nodes: [],
    edges: [],
    onNodesChange: (changes) => {
        set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
        }));
    },
    onEdgesChange: (changes) => {
        set((state) => ({
            edges: applyEdgeChanges(changes, state.edges),
        }));
    },
    onConnect: (connection) => {
        set((state) => ({
            edges: addEdge(connection, state.edges),
        }));
    },
    setNodes: (newNodes) => {
        set({ nodes: newNodes });
    },
    setEdges: (newEdges) => {
        set({ edges: newEdges });
    },
}));


export default useStore;
