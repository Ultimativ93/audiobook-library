// "NodeTypesDataFormat.js" is accessed by the "Editor" component.
// It provides the different nodes with the data formats needes aswell with an individual id.
// It is a child of "Editor" view component.
const NodeTypesDataFormat = (nodeType, ids, nodes) => {
    const inputSelections = {
        mouse: '', touch: '', speak: '', keyboard: '', shake: ''
    };

    const commonAttributes = {
        label: '', audioStory: '', isEnd: '', interactionSignal: '', interactionSignalAudio: '', question: '', questionAudio: '', randomAudio: '', repeatQuestionAudio: '', backgroundAudio: [], note: '',
    };

    const getLastCount = () => {
        let lastCount = 0;
        nodes.forEach(node => {
            if (node.type === nodeType) {
                const labelParts = node.data.label.split(' ');
                const nodeCount = parseInt(labelParts[labelParts.length - 1]);
                if (!isNaN(nodeCount) && nodeCount > lastCount) {
                    lastCount = nodeCount;
                }
            }
        });
        return lastCount;
    };

    let count = getLastCount() + 1;
    const asignId = parseInt(ids, 10) + 1;

    const generateNodeTypeData = (type, customData = {}) => {
        switch (type) {
            case 'muChoi':
                return {
                    id: String(asignId),
                    type: 'muChoi',
                    position: { x: 100, y: 300 },
                    data: {
                        ...commonAttributes,
                        ...customData,
                        inputSelections,
                        label: `Choice ${count++}`,
                        answers: ["Insert Answer 1", "Insert Answer 2"],
                        answerAudios: [],
                        id: String(asignId),
                    }
                };
            case 'bridgeNode':
                console.log('in bridge');
                return {
                    id: String(asignId),
                    type: 'bridgeNode',
                    position: { x: 100, y: 300 },
                    data: {
                        ...commonAttributes,
                        ...customData,
                        label: `Bridge ${count++}`,
                        id: String(asignId),
                    }
                };
            case 'timeNode':
                console.log('in timeNode');
                return {
                    id: String(asignId),
                    type: 'timeNode',
                    position: { x: 100, y: 300 },
                    data: {
                        ...commonAttributes,
                        label: `Time ${count++}`,
                        answers: [
                            { answer: "Insert Answer 1", time: "" },
                            { answer: "Insert Answer 2", time: "" }
                        ],
                        answerAudios: [],
                        answerProcessAudio: '',
                        answerProcessAudioLength: '',
                        id: String(asignId),
                    }
                };
            case 'muAns':
                console.log('in muAns');
                return {
                    id: String(asignId),
                    type: 'muAns',
                    position: { x: 100, y: 350 },
                    data: {
                        ...commonAttributes,
                        label: `Combination ${count++}`,
                        answers: ["Insert Answer 1", "Insert Answer 2"],
                        answerAudios: [],
                        answerCombinations: [],
                        id: String(asignId),
                    }
                };
            case 'reactNode':
                console.log('in reactNode');
                return {
                    id: String(asignId),
                    type: 'reactNode',
                    position: { x: 100, y: 375 },
                    data: {
                        ...commonAttributes,
                        label: `Reaction ${count++}`,
                        answerPeriods: [
                            { start: '00:00', end: '00:00', answer: 'Insert Period 1' },
                        ],
                        answerProcessAudio: '',
                        answerProcessAudioLength: '',
                        id: String(asignId),
                    }
                };
            case 'inputNode':
                console.log('in inputNode');
                return {
                    id: String(asignId),
                    type: 'inputNode',
                    position: { x: 100, y: 390 },
                    data: {
                        ...commonAttributes,
                        label: `Input ${count++}`,
                        correctAnswer: '',
                        id: String(asignId),
                    },
                };
            case 'endNode':
                console.log('in endNode');
                return {
                    id: String(asignId),
                    type: 'endNode',
                    position: { x: 100, y: 500 },
                    data: {
                        ...commonAttributes,
                        label: `Ending ${count++}`,
                        id: String(asignId),
                        isEnd: 'true',
                    }
                };
            default:
                return null;
        }
    };

    return generateNodeTypeData(nodeType);
};

export default NodeTypesDataFormat;