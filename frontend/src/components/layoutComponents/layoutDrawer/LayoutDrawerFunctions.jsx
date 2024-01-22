// Updates label of a node, after it gets changed in the drawer
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

// Lets put this into updateNodeLabel, like we do in updateAudioStory
const updateNodeLabelWrapper = (setNodes, nodeData, event) => {
    console.log("Event in updateNodeLabelWrapper", event.target.value)
    const newLabel = event.target.value;
    updateNodeLabel(setNodes, nodeData.id, newLabel);
};

// Updates audioStory of a node, after it gets changed in the drawer
const updateAudioStory = (setNodes, nodeData, event) => {
    const newAudioStory = event.target.value;

    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        audioStory: newAudioStory,
                    },
                };
            }
            return node;
        });
    });
}

// Updates isEnd of a node, after it gets changed in the drawer
const updateIsEnd = (setNodes, nodeData, event) => {
    const newIsEnd = event.target.checked;
    console.log("newIsEnd: ", newIsEnd);

    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isEnd: `${newIsEnd}`,
                    },
                };
            }
            return node;
        });
    });
};

export { updateNodeLabel, updateNodeLabelWrapper, updateAudioStory, updateIsEnd };
