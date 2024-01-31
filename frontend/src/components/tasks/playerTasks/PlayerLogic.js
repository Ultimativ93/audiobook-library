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

const handleButtonClickLogic = (index, flow, currentNodeProps, setCurrentNode) => {
    const outgoingEdges = flow.edges.filter((edge) => edge.source === currentNodeProps.id);
    console.log("Outgoing Edges: ", outgoingEdges);
  
    // Find the edge with the matching sourceHandle (using the last value in the sourceHandles array).
    const targetEdge = outgoingEdges.find((edge) => edge.sourceHandle === `${currentNodeProps.id}-handle-${index}`);
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
    handleButtonClickLogic
}; 