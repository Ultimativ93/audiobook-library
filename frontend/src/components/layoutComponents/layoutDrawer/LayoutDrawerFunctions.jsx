// Updates label of a node, after it gets changed in the drawer
const updateNodeLabel = (setNodes, nodeId, event) => {
    console.log("Event in updateNodeLabel", event.target.value)
    const newLabel = event.target.value;
    console.log("NewLabel:", newLabel)

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

// Updates audioStory of a node, after it gets changed in the drawer
const updateStoryAudio = (setNodes, nodeData, event) => {
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

// Updates question of a node, after it gets changed in the drawer
const updateQuestion = (setNodes, nodeData, event) => {
    const newQuestion = event.target.value;
    console.log("newQuestion: ", newQuestion);

    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        question: newQuestion,
                    },
                };
            }
            return node;
        });
    });
};

// Updates repearQuestionAudio of a node, after it gets changed in the drawer
const updateRepeatQuestion = (setNodes, nodeData, event) => {
    const newRepeatQuestion = event.target.checked;
    console.log("newRepeatQuestion: ", newRepeatQuestion);

    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        repeatQuestionAudio: `${newRepeatQuestion}`,
                    },
                };
            }
            return node;
        });
    });
};

// Remove answer from node and update related edges
const removeAnswer = (setNodes, setEdges, edges, nodeData, index, setAnswers) => {
    const newAnswers = [...nodeData.data.answers];
    newAnswers.splice(index, 1);

    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                const updatedData = {
                    ...node.data,
                    answers: newAnswers,
                };

                if (edges) {
                    const updatedEdges = edges.filter((edge) => {
                        if (edge && edge.sourceHandle !== undefined && edge.sourceHandle !== null) {
                            const targetAnswerIndex = parseInt(edge.sourceHandle.split('-').pop(), 10);
                            return targetAnswerIndex !== index;
                        }
                        return true;
                    });

                    const updatedEdgesWithNewSourceHandles = updatedEdges.map((edge) => {
                        if (edge.sourceHandle !== undefined && edge.sourceHandle !== null) {
                            const targetAnswerIndex = parseInt(edge.sourceHandle.split('-').pop(), 10);
                            if (targetAnswerIndex > index) {
                                const newSourceHandle = `2-handle-${targetAnswerIndex - 1}`;
                                return { ...edge, sourceHandle: newSourceHandle };
                            }
                        }
                        return edge;
                    });

                    setEdges(updatedEdgesWithNewSourceHandles);
                    setAnswers((prevAnswers) => {
                        return newAnswers;
                    });
                    return {
                        ...node,
                        data: updatedData,
                        edges: updatedEdgesWithNewSourceHandles,
                    };
                }

                setAnswers((prevAnswers) => {
                    return newAnswers;
                });
                return {
                    ...node,
                    data: updatedData,
                };
            }
            return node;
        });
    });
};

// Update AnswersAndTimes, can be changed to updateNodeProperty !!!!!
const updateAnswersAndTimes = (setNodes, nodeData, updatedAnswers) => {
    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        answers: updatedAnswers,
                    },
                };
            }
            return node;
        });
    });
};

// Update answerCombination
const updateAnswerCombination = (setNodes, nodeData, updatedCombination) => {
    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                // Check if the combination already exists
                const existingCombination = node.data.answerCombinations || [];

                const isCombinationExist = existingCombination.find((combination) => {
                    if (
                        combination.answers &&
                        combination.answers.length === updatedCombination.answers.length &&
                        combination.answers.every((answer) => updatedCombination.answers.includes(answer))
                    ) {
                        return true;
                    }
                    return false;
                });

                if (!isCombinationExist) {
                    const isPermutationExist = existingCombination.find((combination) => {
                        if (
                            combination.answers &&
                            combination.answers.length === updatedCombination.answers.length &&
                            combination.answers.every((answer) => updatedCombination.answers.includes(answer))
                        ) {
                            return true;
                        }
                        return false;
                    });

                    if (!isPermutationExist) {
                        const newAnswerCombinations = existingCombination.concat(updatedCombination);

                        return {
                            ...node,
                            data: {
                                ...node.data,
                                answerCombinations: newAnswerCombinations,
                            },
                        };
                    }
                }
            }
            return node;
        });
    });
};

const removeCombination = (setNodes, nodeData, combinationId) => {
    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                const updatedCombinations = (node.data.answerCombinations || []).filter((combination) => combination.id !== combinationId);

                return {
                    ...node,
                    data: {
                        ...node.data,
                        answerCombinations: updatedCombinations,
                    },
                };
            }
            return node;
        });
    });
};

// Updated nodeproperties - we should change all the functions to updateNodeProperty, much less code !!!!!
const updateNodeProperty = (setNodes, nodeData, property, value) => {
    console.log("in updateProperty")
    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        [property]: value,
                    },
                };
            }
            return node;
        });
    });
};

// Updates node Property of checkboxes, after it gets changed in the drawer
const updateNodePropertyCheck = (setNodes, nodeData, property, event) => {
    const propertyValue = event.target.checked;
    console.log("Hast interaction Signal: ", propertyValue);

    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        [property]: `${propertyValue}`,
                    },
                };
            }
            return node;
        });
    });
};

export {
    updateNodeLabel,
    updateStoryAudio,
    updateIsEnd,
    updateQuestion,
    updateRepeatQuestion,
    updateNodeProperty,
    updateNodePropertyCheck,
    updateAnswersAndTimes,
    updateAnswerCombination,
    removeAnswer,
    removeCombination,
};
