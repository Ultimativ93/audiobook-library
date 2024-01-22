const updateNodeLabel = (setNodes, nodeId, newLabel) => {
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

const updateNodeLabelWrapper = (setNodes, nodeData, event) => {
    console.log("Event in updateNodeLabelWrapper", event)
    const newLabel = event.target.value;
    updateNodeLabel(setNodes, nodeData.id, newLabel);
};

const updateAudioStory = (setNodes, nodeData) => {
    console.log('in updateAudioStory')
}


export { updateNodeLabel, updateNodeLabelWrapper, updateAudioStory };
