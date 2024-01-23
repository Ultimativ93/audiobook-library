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
            case 'start':
                return {
                    type: 'start',
                    label: 'Start',
                    position: { x: 100, y: 100 },
                    data: {
                        ...commonAttributes,
                        ...customData,
                    }
                }
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
                        answers: ["", ""],
                    }
                };
            case 'bridge':
                console.log('in der bridge')
                return {
                    type: 'bridge',
                    position: { x: 300, y: 100 },
                    data: {
                        ...commonAttributes,
                        ...customData,
                    }
                };
            default:
                return null;
        }
    };

    return generateNodeTypeData(nodeType);
}

export default NodeTypesDataFormat;