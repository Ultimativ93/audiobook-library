const NodeTypesDataFormat = (nodeType, ids) => {

    const asignId = ids+1;
    
    const inputSelections = {
        mouse: '', touch: '', speak: '', keyboard: '', touchKeyboard: '', shake: ''
    }

    const commonAttributes = {
        label: '', audioStory: '', isEnd: '',
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
                        question: '',
                        questionAudio: '',
                        randomAudio: '',
                        repeatQuestionAudio: '',
                        answers: ["Answer 1", "Answer 2"],
                        id: String(asignId),
                    }
                };
            case 'bridge':
                console.log('in bridge')
                return {
                    type: 'bridge',
                    position: { x: 300, y: 100 },
                    data: {
                        ...commonAttributes,
                        ...customData,
                    }
                };
            case 'endNode':
                console.log('in endNode')
                return {
                    id: String(asignId),
                    type: 'endNode',
                    position: {x: 100, y: 500},
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