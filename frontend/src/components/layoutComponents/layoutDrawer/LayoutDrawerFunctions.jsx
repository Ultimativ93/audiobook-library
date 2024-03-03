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

const removeCombination = (setNodes, setEdges, prevEdges, nodeData, combinationId) => {
    setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
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

        const { updatedEdges, deletedEdgeIds } = updateEdges(prevEdges, nodeData.id, combinationId);

        setEdges(updatedEdges);

        if (deletedEdgeIds.length > 0) {
            setEdges((prevEdges) => prevEdges.filter((edge) => !deletedEdgeIds.includes(edge.id)));
        }

        return updatedNodes;
    });
};

// Klappt noch
const updateEdges = (prevEdges, nodeId, combinationId) => {
    let deletedEdgeIds = [];
    let updatedEdges = [];
    combinationId = combinationId - 1;

    console.log("prevEdges, nodeId, combinationId", prevEdges, nodeId, combinationId);
    const remainingCombinations = prevEdges.filter(edge => edge.sourceHandle.startsWith(`${nodeId}-handle-`)).length;
    console.log("remainingCombinations, ", remainingCombinations);

    if (remainingCombinations-1 <= combinationId) {
        console.log("dekrementieren combinationId")
        combinationId--;
    }
    
    prevEdges.forEach((edge) => {
        console.log("Edge", edge);

        if (edge.sourceHandle === `${nodeId}-handle-${combinationId}` || remainingCombinations === 1) {
            console.log("Deleting Edge with source handle:", edge.sourceHandle);
            deletedEdgeIds.push(edge.id);
        }

        const handleParts = edge.sourceHandle.split('-');
        const handleIndex = parseInt(handleParts[handleParts.length - 1], 10);
        console.log("handleIndex, combinationId", handleIndex, combinationId);

        if (handleIndex >= combinationId) {

            const targetParts = edge.target.split('-');
            const targetIndex = parseInt(targetParts[targetParts.length - 1], 10);
            const updatedTarget = `${targetParts.slice(0, -1).join('-')}${targetIndex}`;
            const updatedSourceHandle = `${nodeId}-handle-${handleIndex-1}`
            console.log("updatedSourceHandle", updatedSourceHandle);
            console.log("updatedTarget, edge", updatedTarget, edge);
            edge.sourceHandle = updatedSourceHandle;
            edge.target = updatedTarget;
        }

        updatedEdges.push(edge);
    });

    console.log("Deleted edge IDs:", deletedEdgeIds);
    console.log("Updated edges:", updatedEdges);
    return { updatedEdges, deletedEdgeIds };
};

// Updates nodeproperties
const updateNodeProperty = (setNodes, nodeData, property, value) => {
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
    const flow = await fetchFlow(params)
    for (const node of flow.nodes) {
        if (node.data) {
            for (const value of Object.values(node.data)) {
                if (Array.isArray(value)) {
                    for (const item of value) {
                        if (item && typeof item === 'object' && item.backgroundAudio && typeof item.backgroundAudio === 'string' && item.backgroundAudio.includes(audioName)) {
                            return true;
                        } else if (typeof item === 'string' && item.includes(audioName)) {
                            return true;
                        }
                    }
                } else {
                    if (typeof value === 'object' && value.backgroundAudio && typeof value.backgroundAudio === 'string' && value.backgroundAudio.includes(audioName)) {
                        return true;
                    } else if (typeof value === 'string' && value.includes(audioName)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

const updateBackgroundAudio = (setNodes, nodeData, backgroundAudioFor, selectedAudio, showAudio) => {
    setNodes((prevNodes) => {
        return prevNodes.map((node) => {
            if (node.id === nodeData.id) {
                let updatedBackgroundAudio = [...node.data.backgroundAudio];

                if (!showAudio) {
                    updatedBackgroundAudio = updatedBackgroundAudio.filter(audio => audio.audio !== backgroundAudioFor);
                } else {
                    const existingAudioIndex = updatedBackgroundAudio.findIndex(audio => audio.audio === backgroundAudioFor);
                    if (existingAudioIndex !== -1) {
                        updatedBackgroundAudio[existingAudioIndex] = { audio: backgroundAudioFor, backgroundAudio: selectedAudio };
                    } else {
                        updatedBackgroundAudio.push({ audio: backgroundAudioFor, backgroundAudio: selectedAudio });
                    }
                }

                const updatedData = {
                    ...node.data,
                    backgroundAudio: updatedBackgroundAudio,
                };
                return {
                    ...node,
                    data: updatedData,
                };
            }
            return node;
        });
    });
};


export {
    updateNodeProperty,
    updateAnswerCombination,
    removeAnswer,
    removeCombination,
    isAudioUsed,
    useAudioUsage,
    updateBackgroundAudio,
};
