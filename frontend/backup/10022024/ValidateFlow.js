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

    return missingData.length > 0 ? `Missing data for Input Node ${node.data.label}: ${missingData.join(", ")}` : null;
}

const validateEdges = (nodes, edges) => {
    const invalidEdges = new Map();

    nodes.forEach(node => {
        let errorMessage = "";

        if (node.data && node.data.isStart === 'true') {
            return;
        }

        if (node.type !== 'endNode') {
            if (node.type === 'muAns') {
                if (node.data.answerCombinations && node.data.answerCombinations.length > 0) {
                    node.data.answerCombinations.forEach(combination => {
                        const handleId = `${node.id}-handle-${combination.id}`;
                        const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
                        if (!outgoingEdge) {
                            errorMessage += `has no outgoing edge from handle ${handleId}, `;
                        }
                    });
                } else {
                    errorMessage += "has no answer combinations defined, ";
                }
            } else if (node.type === 'reactNode') {
                const expectedHandleCount = node.data.answerPeriods ? node.data.answerPeriods.length + 1 : 1;
                for (let i = 0; i < expectedHandleCount; i++) {
                    const handleId = `${node.id}-handle-${i}`;
                    const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
                    if (!outgoingEdge) {
                        errorMessage += `has no outgoing edge from handle ${handleId}, `;
                    }
                }
            } else {
                if (node.data.answers) {
                    node.data.answers.forEach((answer, index) => {
                        const handleId = `${node.id}-handle-${index}`;
                        const outgoingEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === handleId);
                        if (!outgoingEdge) {
                            errorMessage += `has no outgoing edge from handle ${handleId}, `;
                        }
                    });
                }
            }

            const incomingEdge = edges.find(edge => edge.target === node.id);
            if (!incomingEdge) {
                errorMessage += `has no incoming edge, `;
            }
        } else {
            const incomingEdge = edges.find(edge => edge.target === node.id);
            if (!incomingEdge) {
                errorMessage += `has no incoming edge, `;
            }
        }

        if (errorMessage.trim() !== "") {
            if (invalidEdges.has(node.type)) {
                invalidEdges.set(node.type, `${invalidEdges.get(node.type)} ${errorMessage}`);
            } else {
                invalidEdges.set(node.type, errorMessage);
            }
        }
    });

    return Array.from(invalidEdges);
};


export {
    validateMuChoi,
    validateEndNode,
    validateBridgeNode,
    validateTimeNode,
    validateMuAns,
    validateReactNode,
    validateInputNode,
    validateEdges,
};
