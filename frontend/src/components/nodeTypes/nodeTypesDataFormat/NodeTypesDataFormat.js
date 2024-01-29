const NodeTypesDataFormat = (nodeType, ids) => {

    console.log("In nodeTypeDataFormat ids: ", ids)
    const asignId = parseInt(ids, 10) + 1;

    const inputSelections = {
        mouse: '', touch: '', speak: '', keyboard: '', touchKeyboard: '', shake: ''
    }

    const commonAttributes = {
        label: '', audioStory: '', isEnd: '', interactionSignal: '', interactionSignalAudio: '', question: '', questionAudio: '', randomAudio: '', repeatQuestionAudio: '',
    }

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
                        label: 'Multiple Choice added',
                        answers: ["Answer 1", "Answer 2"],
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
                        label: 'Bridge Added',
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
                        label: 'Time Added',
                        answers: [
                            { answer: "Answer 1", time: "Time 1" },
                            { answer: "Answer 2", time: "Time 2" }
                          ],
                        id: String(asignId),
                    }
                }
            case 'muAns':
                console.log('in muAns');
                return {
                    id: String(asignId),
                    type: 'muAns',
                    position: { x: 100, y:350},
                    data: {
                        ...commonAttributes,
                        label: 'Multiple Answers Added',
                        answers: ["Answer 1", "Answer 2"],
                        answerCombinations: [],
                        id: String(asignId),
                    }
                };
            case 'endNode':
                console.log('in endNode');
                return {
                    id: String(asignId),
                    type: 'endNode',
                    position: { x: 100, y: 500 },
                    data: {
                        ...commonAttributes,
                        label: 'End Added',
                        id: String(asignId),
                        isEnd: 'true',
                    }
                }
            default:
                return null;
        }
    };

    return generateNodeTypeData(nodeType);
}

export default NodeTypesDataFormat;