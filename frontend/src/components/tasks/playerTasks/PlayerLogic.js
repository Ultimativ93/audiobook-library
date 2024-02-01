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
        audioContext.close(); // Close the AudioContext to release resources
    }
};

const handleAudioEnded = (currentNodeProps, flow, setCurrentNode) => {
    console.log("curNodProp", flow.nodes);
    if (flow && flow.nodes) {
        const targetNodeIndex = flow.nodes.findIndex((node) => node.id === currentNodeProps.id);
        console.log("type in handleAudioEnded", flow.nodes[targetNodeIndex].type)
        if (flow.nodes[targetNodeIndex].type && flow.nodes[targetNodeIndex].type === 'bridgeNode') {
            // Call handleButtonClickLogic with appropriate parameters
            handleButtonClickLogic(0, flow, currentNodeProps, setCurrentNode);
        }
    }
};


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
    handleAudioEnded,
}; 