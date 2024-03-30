// "ValidateFlow.js" validates the different node types in "LayoutMenuModalPreview" and before the publish in "LayoutMenuModalPublish". 
// Its prior use is in the "LayoutMenuModalPreview" and "LayoutMenuModalPublish" components.
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

    if (node.data.interactionSignal === 'true' && node.data.interactionSignal !== '') {
        if (!node.data.interactionSignalAudio && !node.data.interactionSignalAudio !== '') {
            missingData.push(`Interaction Signal Audio is missing.`)
        }
    }

    return missingData.length > 0 ? `Missing data for Choice Node with Label: ${node.data.label}: ${missingData.join(", ")}` : null;
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

            const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

            const isValidTime = (time) => {
                return timePattern.test(time);
            }

            if (!answer.time) {
                missingData.push(`Time for Answer ${index + 1} is missing.`);
            }
            if (!node.data.answerAudios || !node.data.answerAudios[index]) {
                missingData.push(`Audio for Answer ${index + 1} is missing.`);
            }
            if (answer.time) {
                const validTime = isValidTime(answer.time);
                if (!validTime) {
                    missingData.push(`Time in answer ${index + 1} has to be correctly formated (01:23).`);
                }
                if (answer.time === '00:00') {
                    missingData.push(`Time in answer ${index + 1} has to be at least 1 second delayed.`)
                }

                // Get audio length in seconds
                const audioLengthInSeconds = node.data.answerProcessAudioLength.split(':')
                    .map(Number)
                    .reduce((acc, val, index) => acc + val * (index === 0 ? 60 : 1), 0);

                // Get answer time in seconds
                const answerTimeInSeconds = answer.time.split(':')
                    .map(Number)
                    .reduce((acc, val, index) => acc + val * (index === 0 ? 60 : 1), 0);

                if (answerTimeInSeconds > audioLengthInSeconds) {
                    missingData.push(`Answer time in answer ${index + 1} exceeds the length of the audio.`);
                }
            }
        });
    }

    if (node.data.backgroundAudioSelected) {
        if (!node.data.backgroundAudio) {
            missingData.push(`Backgroundaudio is missing.`)
        }
    }

    if (node.data.interactionSignal === 'true' && node.data.interactionSignal !== '') {
        if (!node.data.interactionSignalAudio && !node.data.interactionSignalAudio !== '') {
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

    if (node.data.interactionSignal === 'true' && node.data.interactionSignal !== '') {
        if (!node.data.interactionSignalAudio && !node.data.interactionSignalAudio !== '') {
            missingData.push(`Interaction Signal Audio is missing.`)
        }
    }

    return missingData.length > 0 ? `Missing data for Multiple Response Node ${node.data.label}: ${missingData.join(", ")}` : null;
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

        const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

        const isValidTimeFormat = (time) => {
            return timePattern.test(time);
        }

        const periodToSecond = (period) => {
            const [minutes, seconds] = period.split(':').map(Number);
            const totalSeconds = minutes * 60 + seconds;
            return totalSeconds;
        }

        const endPeriodLargerThanStart = (period) => {
            const startPeriodSeconds = periodToSecond(period.start);
            const endPeriodSeconds = periodToSecond(period.end);
            return startPeriodSeconds >= endPeriodSeconds;
        }

        const audioLengthInSeconds = periodToSecond(node.data.answerProcessAudioLength);

        const periods = node.data.answerPeriods;

        periods.forEach((period, index) => {
            if (period.start && period.end) {
                const validStartTime = isValidTimeFormat(period.start);
                const validEndTime = isValidTimeFormat(period.end);
                if (!validStartTime || !validEndTime) {
                    missingData.push(`Start and/or end time in answer ${index + 1} have to be correctly formatted (01:23)`);
                } else {
                    const endPeriodIsLarger = endPeriodLargerThanStart(period);
                    if (endPeriodIsLarger) {
                        missingData.push(`End time in answer ${index + 1} has to be greater than start time.`);
                    }
                    const startSeconds = periodToSecond(period.start);
                    const endSeconds = periodToSecond(period.end);
                    if (startSeconds < 0 || endSeconds > audioLengthInSeconds) {
                        missingData.push(`Answer period ${index + 1} exceeds the length of the audio.`);
                    }
                    if (index > 0) {
                        const previousPeriod = periods[index - 1];
                        const previousEndTime = periodToSecond(previousPeriod.end);
                        const currentStartTime = periodToSecond(period.start);

                        if (previousEndTime > currentStartTime) {
                            missingData.push(`Answer period ${index + 1} overlaps with the previous period.`);
                        }
                    }
                }
            } else {
                missingData.push(`Incomplete time range for answer ${index + 1}. Both start and end times are required.`);
            }
        });
    }

    if (node.data.backgroundAudioSelected) {
        if (!node.data.backgroundAudio) {
            missingData.push(`Backgroundaudio is missing.`)
        }
    }

    if (node.data.interactionSignal === 'true' && node.data.interactionSignal !== '') {
        if (!node.data.interactionSignalAudio && !node.data.interactionSignalAudio !== '') {
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

    if (node.data.interactionSignal === 'true' && node.data.interactionSignal !== '') {
        if (!node.data.interactionSignalAudio && !node.data.interactionSignalAudio !== '') {
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