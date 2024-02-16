import { fetchFlow } from '../../tasks/editorTasks/FetchFlow';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
    console.log("in updateProperty", value)
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

const useAudioUsage = (audioPaths) => {
    const [audioUsage, setAudioUsage] = useState({});
    const params = useParams();

    useEffect(() => {
        const fetchAudioUsage = async () => {
            const usage = {};
            for (const audio of audioPaths) {
                const isUsed = await isAudioUsed(audio.audioName, params.audiobookTitleParam);
                usage[audio.audioName] = isUsed;
            }
            setAudioUsage(usage);
        };

        fetchAudioUsage();
    }, [audioPaths, params.audiobookTitleParam]);

    return audioUsage;
}

const isAudioUsed = async (audioName, params) => {
    console.log("In LDF isAudioUsed: ", audioName);
    console.log("Params in isAudioUsed:", params);
    const flow = await fetchFlow(params)
    console.log("Flow in isAudioUsed:", flow);
    console.log("Nodes Audiostory", flow.nodes[1].data.audioStory)

    for (const node of flow.nodes) {
        if (node.data && Object.values(node.data).some(value => typeof value === 'string' && value.includes(audioName))) {
            console.log("wir kommen hier rein");
            return true;
        }
    }
    return false;
}

export {
    updateNodeProperty,
    updateAnswerCombination,
    removeAnswer,
    removeCombination,
    isAudioUsed,
    useAudioUsage,
};
