import axios from 'axios';

const getAudioPathFromName = async (audioName) => {
    try {
        const response = await axios.get(`http://localhost:3005/getAudioName?audioName=${audioName}`)
        if (response.status === 200) {
            return response.data;
        } else {
            console.warn(`No audioPath found for path ${audioName} in the database, PlayerLogic`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching audioPath with ${audioName} from the database`, error);
        return null;
    }
};

const getAudioFromPath = async (audioPath) => {
    try {
        const response = await axios.get(`http://localhost:3005/getAudio?audioPath=${audioPath}`, {
            responseType: 'blob',
        });

        if (response.status === 200) {
            const blob = response.data;
            const audioUrl = URL.createObjectURL(blob);
            return audioUrl;
        } else {
            console.warn(`Unexpected status code ${response.status} while fetching audio for path ${audioPath} in the database, PlayerLogic`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching audio with path ${audioPath} from the database`, error);
        return null;
    }
};

const getCurrentAudioLength = async (audioBlob) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    try {
        const audio = new Audio(audioBlob);
        
        const loadedMetadataPromise = new Promise((resolve, reject) => {
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
            audio.addEventListener('error', reject);
        });

        await audio.load();
        await loadedMetadataPromise;

        const duration = audio.duration;

        return duration;
    } catch (error) {
        console.error("Error getting audio duration", error);
        return null;
    } finally {
        audioContext.close();
    }
};
/*
const handleAudioEnded = async (currentNodeProps, flow, setCurrentNode) => {
    if (flow && flow.nodes) {
        const targetNodeIndex = flow.nodes.findIndex((node) => node.id === currentNodeProps.id);

        if (targetNodeIndex !== -1) {
            const targetNodeType = flow.nodes[targetNodeIndex].type;

            if (targetNodeType === 'bridgeNode') {
                handleButtonClickLogic(0, flow, currentNodeProps, setCurrentNode);
            } else if (targetNodeType === 'reactNode') {
                const lastPeriodIndex = currentNodeProps.answerPeriods.length;
                handleButtonClickLogic(lastPeriodIndex, flow, currentNodeProps, setCurrentNode);
            } else if (targetNodeType === 'timeNode') {
                const lastAnswerIndex = currentNodeProps.answers.length - 1;
                handleButtonClickLogic(lastAnswerIndex, flow, currentNodeProps, setCurrentNode);
            }
            
            if (targetNodeType !== 'bridgeNode' && targetNodeType !== 'endNode') {
                console.log("TargetType: ", targetNodeType);
                // Wenn die Zielknotenart nicht 'timeNode' ist, spiele data.questionAudio ab
                const questionAudioPath = await getAudioPathFromName(currentNodeProps.questionAudio);
                const questionAudioBlob = await getAudioFromPath(questionAudioPath);

                if (questionAudioBlob) {
                    const audioElement = new Audio(questionAudioBlob);
                    audioElement.play();
                }
            }
        }
    }
}; */


const handleButtonClickLogic = (index, flow, currentNodeProps, setCurrentNode) => {
    const outgoingEdges = flow.edges.filter((edge) => edge.source === currentNodeProps.id);
    console.log("Outgoing Edges: ", outgoingEdges);

    // Find the edge with the matching target (if sourceHandle is null)
    const targetEdge = outgoingEdges.find((edge) => edge.sourceHandle === null || edge.sourceHandle === `${currentNodeProps.id}-handle-${index}`);
    console.log("targetEdge: ", targetEdge);

    if (targetEdge) {
        const targetNodeIndex = flow.nodes.findIndex((node) => node.id === targetEdge.target);

        if (targetNodeIndex !== -1) {
            console.log("TargetNode: ", targetNodeIndex);
            setCurrentNode(targetNodeIndex);
        }
    }
};


export {
    getAudioPathFromName,
    getAudioFromPath,
    getCurrentAudioLength,
    handleButtonClickLogic,
    //handleAudioEnded,
}; 