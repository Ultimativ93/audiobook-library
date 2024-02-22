const validateMuChoi = (node) => {
    let missingData = [];

    if (!node.data.audioStory) {
        missingData.push("Audio Story is missing.");
    }

    if (!node.data.question) {
        missingData.push("Question is missing.");
    }

    if (!node.data.questionAudio) {
        missingData.push("Question Audio is missing.");
    }

    if (!node.data.answers || node.data.answers.length === 0) {
        missingData.push("Answers are missing.");
    } else {
        node.data.answers.forEach((answer, index) => {
            if (!node.data.answerAudios[index]) {
                missingData.push(`Audio for Answer ${index + 1} is missing.`);
            }
        });
    }

    if (node.data.backgroundAudioSelected) {
        if (!node.data.backgroundAudio) {
            missingData.push(`Backgroundaudio is missing.`)
        }
    } 

    if (node.data.interactionSignal) {
        if ((node.data.interactionSignalAudio === '' || !node.data.interactionSignalAudio) && (!node.data.interactionSignal || node.data.interactionSignal === '')) {
            missingData.push(`Interaction Signal Audio is missing.`)
        }
    }

    return missingData.length > 0 ? `Missing data for Multiple Choice Node with Label: ${node.data.label}: ${missingData.join(", ")}` : null;
};

const validateEndNode = (node) => {
    let missingData = [];

    if (!node.data.audioStory) {
        missingData.push("Audio Story missing.");
    }

    return missingData.length > 0 ? `Missing data for End Node ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateBridgeNode = (node) => {
    let missingData = [];

    if (!node.data.audioStory) {
        missingData.push("Audio Story missing.");
    }

    return missingData.length > 0 ? `Missing data for Bridge Node ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateTimeNode = (node) => {
    let missingData = [];

    if (!node.data.audioStory) {
        missingData.push("Audio Story missing.");
    }

    if (!node.data.question) {
        missingData.push("Question is missing.");
    }

    if (!node.data.questionAudio) {
        missingData.push("Question Audio is missing.");
    }
    
    if (!node.data.answers || node.data.answers.length === 0) {
        missingData.push("Answers are missing.");
    } else {
        node.data.answers.forEach((answer, index) => {
            
            if (!answer.time) {
                missingData.push(`Time for Answer ${index + 1} is missing.`);
            }
            if (!node.data.answerAudios || !node.data.answerAudios[index]) {
                
                missingData.push(`Audio for Answer ${index + 1} is missing.`);
            }
        });
    }

    if (node.data.backgroundAudioSelected) {
        if (!node.data.backgroundAudio) {
            missingData.push(`Backgroundaudio is missing.`)
        }
    } 

    if (node.data.interactionSignal) {
        if (!node.data.interactionSignalAudio) {
            missingData.push(`Interaction Signal Audio is missing.`)
        }
    }

    if (!node.data.answerProcessAudio) {
        missingData.push(`Answer Process Audio is missing.`)
    }

    return missingData.length > 0 ? `Missing data for Time Node ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateMuAns = (node) => {
    let missingData = [];
    let hasCombination = false;

    if (!node.data.audioStory) {
        missingData.push("Audio Story is missing.");
    }

    if (!node.data.question) {
        missingData.push("Question is missing.");
    }

    if (!node.data.questionAudio) {
        missingData.push("Question Audio is missing.");
    }

    if (!node.data.answers || node.data.answers.length === 0) {
        missingData.push("Answers are missing.");
    } else {
        node.data.answers.forEach((answer, index) => {
            if (!node.data.answerAudios || !node.data.answerAudios[index]) {
                missingData.push(`Audio for Answer ${index + 1} is missing.`);
            }
        });
    }

    if (node.data.answerCombinations.length > 0) {
        hasCombination = true;
    }

    if (!hasCombination) {
        missingData.push("At least one answer combination is required.");
    }

    if (node.data.backgroundAudioSelected) {
        if (!node.data.backgroundAudio) {
            missingData.push(`Backgroundaudio is missing.`)
        }
    } 

    if (node.data.interactionSignal) {
        if (!node.data.interactionSignalAudio) {
            missingData.push(`Interaction Signal Audio is missing.`)
        }
    }

    return missingData.length > 0 ? `Missing data for Multiple Answer Node ${node.data.label}: ${missingData.join(", ")}` : null;
}


const validateReactNode = (node) => {
    let missingData = [];

    if (!node.data.audioStory) {
        missingData.push("Audio Story is missing.");
    }

    if (!node.data.question) {
        missingData.push("Question is missing.");
    }

    if (!node.data.questionAudio) {
        missingData.push("Question Audio is missing.");
    }

    if (!node.data.answerAudios || node.data.answerAudios.length === 0) {
        missingData.push("Answer Audios are missing.");
    } else {
        node.data.answerAudios.forEach((audio, index) => {
            if (!audio) {
                missingData.push(`Audio for Answer ${index + 1} is missing.`);
            }
        });
    }

    if (!node.data.answerPeriods || node.data.answerPeriods.length === 0) {
        missingData.push("Answer Periods are missing.");
    } else {
        let allZeroStartEnd = true;
        node.data.answerPeriods.forEach((period, index) => {
            if (period.start !== "00:00" || period.end !== "00:00") {
                allZeroStartEnd = false;
            }
        });
        if (allZeroStartEnd) {
            missingData.push("At least one Answer Period should have non-zero start and end values.");
        }
    }

    if (node.data.backgroundAudioSelected) {
        if (!node.data.backgroundAudio) {
            missingData.push(`Backgroundaudio is missing.`)
        }
    } 

    if (node.data.interactionSignal) {
        if (!node.data.interactionSignalAudio) {
            missingData.push(`Interaction Signal Audio is missing.`)
        }
    }

    if (!node.data.answerProcessAudio) {
        missingData.push(`Answer Process Audio is missing.`)
    }

    return missingData.length > 0 ? `Missing data for React Node ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateInputNode = (node) => {
    let missingData = [];

    if (!node.data.audioStory) {
        missingData.push("Audio Story is missing.");
    }

    if (!node.data.question) {
        missingData.push("Question is missing.");
    }

    if (!node.data.questionAudio) {
        missingData.push("Question Audio is missing.");
    }

    if (!node.data.correctAnswer) {
        missingData.push("Correct Answer missing.")
    }

    if (node.data.backgroundAudioSelected) {
        if (!node.data.backgroundAudio) {
            missingData.push(`Backgroundaudio is missing.`)
        }
    } 

    if (node.data.interactionSignal) {
        if (!node.data.interactionSignalAudio) {
            missingData.push(`Interaction Signal Audio is missing.`)
        }
    }

    return missingData.length > 0 ? `Missing data for Input Node ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeMuChoi = (node, edges) => {
    let missingData = [];

    const incomingEdge = edges.find(edge => edge.target === node.id);
    if (!incomingEdge) {
        missingData.push('has no incoming edge');
    }

    if (node.data.answers) {
        node.data.answers.forEach((answer, index) => {
            const handleId = `${node.id}-handle-${index}`;
            const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
            if (!outgoingEdge) {
                missingData.push(`has no outgoing edge from handle ${handleId}, `);
            }
        })
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeEndNode = (node, edges) => {
    let missingData = [];

    const incomingEdge = edges.find(edge => edge.target === node.id);
    if (!incomingEdge) {
        missingData.push('has no incoming edge');
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeBridgeNode = (node, edges) => {
    let missingData = [];

    const incomingEdge = edges.find(edge => edge.target === node.id);
    if (!incomingEdge) {
        missingData.push(`has no incoming edge`);
    }

    const outgoingEdge = edges.find(edge => edge.source === node.id);
    if (!outgoingEdge) {
        missingData.push(`has no outgoing edge`);
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeTimeNode = (node, edges) => {
    let missingData = [];

    const incomingEdge = edges.find(edge => edge.target === node.id);
    if (!incomingEdge) {
        missingData.push(`has no incoming edge`);
    }

    if (node.data.answers) {
        node.data.answers.forEach((answer, index) => {
            const handleId = `${node.id}-handle-${index}`;
            const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
            if (!outgoingEdge) {
                missingData.push(`has no outgoing edge from handle ${handleId}, `);
            }
        })
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeMuAns = (node, edges) => {
    let missingData = [];

    const incomingEdge = edges.find(edge => edge.target === node.id);
    if (!incomingEdge) {
        missingData.push(`has no incoming edge`);
    }

    if (node.data.answerCombinations) {
        node.data.answerCombinations.forEach((combination, index) => {
            const handleId = `${node.id}-handle-${index}`;
            const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
            if (!outgoingEdge) {
                missingData.push(`has no outgoing edge from handle ${handleId}, `);
            }
        });
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeReactNode = (node, edges) => {
    let missingData = [];

    const incomingEdge = edges.find(edge => edge.target === node.id);
    if (!incomingEdge) {
        missingData.push(`has no incoming edge`);
    }

    const expectedHandleCount = node.data.answerPeriods ? node.data.answerPeriods.length + 1 : 1;
    if (typeof expectedHandleCount === 'number') {
        for (let i = 0; i < expectedHandleCount; i++) {
            const handleId = `${node.id}-handle-${i}`;
            const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
            if (!outgoingEdge) {
                missingData.push(`has no outgoing edge from handle ${handleId}, `);
            }
        }
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeInputNode = (node, edges) => {
    let missingData = [];

    const incomingEdge = edges.find(edge => edge.target === node.id);
    if (!incomingEdge) {
        missingData.push(`has no incoming edge`);
    }

    const expectedHandleCount = 3;
    for (let i = 0; i < expectedHandleCount; i++) {
        const handleId = `${node.id}-handle-${i}`;
        const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
        if (!outgoingEdge) {
            missingData.push(`has no outgoing edge from handle ${handleId}, `);
        }
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdgeStart = (node, edges) => {
    let missingData = [];

    const outgoingEdges = edges.filter(edge => edge.source === node.id);
    if (outgoingEdges.length === 0) {
        missingData.push(`has no outgoing edge`);
    }

    return missingData.length > 0 ? `Missing data for ${node.data.label}: ${missingData.join(", ")}` : null;
}

export {
    validateMuChoi,
    validateEndNode,
    validateBridgeNode,
    validateTimeNode,
    validateMuAns,
    validateReactNode,
    validateInputNode,
    validateEdgeMuChoi,
    validateEdgeEndNode,
    validateEdgeBridgeNode,
    validateEdgeTimeNode,
    validateEdgeMuAns,
    validateEdgeReactNode,
    validateEdgeInputNode,
    validateEdgeStart,
};
