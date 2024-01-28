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

// Updates questionAudio of a node, after it gets changed in the drawer
const updateQuestionAudio = (setNodes, nodeData, event) => {
    const newQuestionAudio = event.target.value;
    console.log("newQuestioNAudio: ", newQuestionAudio);

    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        questionAudio: newQuestionAudio,
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
const removeAnswer = (setNodes, setEdges, edges, nodeData, index) => {
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
              if (edge && edge.sourceHandle !== undefined) {
                const targetAnswerIndex = parseInt(edge.sourceHandle.split('-').pop(), 10);
                return targetAnswerIndex !== index;
              }
              return true;
            });
  
            const updatedEdgesWithNewSourceHandles = updatedEdges.map((edge) => {
              if (edge.sourceHandle !== undefined) {
                const targetAnswerIndex = parseInt(edge.sourceHandle.split('-').pop(), 10);
                if (targetAnswerIndex > index) {
                  const newSourceHandle = `2-handle-${targetAnswerIndex - 1}`;
                  return { ...edge, sourceHandle: newSourceHandle };
                }
              }
              return edge;
            });
  
            setEdges(updatedEdgesWithNewSourceHandles);
            return {
              ...node,
              data: updatedData,
              edges: updatedEdgesWithNewSourceHandles,
            };
          }
  
          return {
            ...node,
            data: updatedData,
          };
        }
        return node;
      });
    });
  };

// Updated nodeproperties - we should change all the functions to updateNodeProperty, much less code !!!!!
const updateNodeProperty = (setNode, nodeData, property, value) => {
    setNode((prevNodes) => {
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

export {
    updateNodeLabel,
    updateStoryAudio,
    updateIsEnd,
    updateQuestion,
    updateQuestionAudio,
    updateRepeatQuestion,
    updateNodeProperty,
    removeAnswer, 
};
