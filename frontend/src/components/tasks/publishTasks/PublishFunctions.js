import axios from 'axios';
import {
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
} from '../editorTasks/ValidateFlow';

// "PublishFunctions.js" handles the functione to publish an audiobook. For example we use fetch all graphic names,
// fetch thumbnails, fetchThumbnail image, validated nodes and edges, upload validated flow, get validated flow title,
// get thumbnail path, delete unused audio files and paths and handle file delete.
// Its main use is in "LayoutMenuModalPublish" component.

export const fetchAllGraphicNames = async (audiobookTitle) => {
    try {
        const fetchedPaths = await axios.get(`http://localhost:3005/getAllGraficNames?audiobookTitle=${audiobookTitle}`);
        const graficPaths = fetchedPaths.data;
        return graficPaths;
    } catch (error) {
        console.error('Error fetching all grafics.', error);
        return;
    }
}

export const fetchThumbnail = async (audiobookTitle) => {
    try {
        const fetchedPath = await axios.get('http://localhost:3005/graficThumbnail', {
            params: {
                audiobookTitle: audiobookTitle
            }
        });
        const graficPath = fetchedPath.data;
        return graficPath;
    } catch (error) {
        console.error('Error fetching thumbnails.', error);
        return;
    }
};

export const fetchThumbnailImage = async (graphicPath) => {
    try {
        const response = await axios.get(`http://localhost:3005/getGraphic?graphicPath=${graphicPath}`, {
            responseType: 'blob'
        });

        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(response.data);
        });
    } catch (error) {
        console.error('Error fetching thumbnail image.', error);
        return null;
    }
};

export const validateNodesAndEdges = (nodes, edges) => {
    const invalidNodes = new Map();
    const invalidEdges = [];

    nodes.forEach(node => {
        let errorMessage = null;

        switch (node.type) {
            case 'muChoi':
                errorMessage = validateMuChoi(node);
                break;
            case 'endNode':
                errorMessage = validateEndNode(node);
                break;
            case 'bridgeNode':
                errorMessage = validateBridgeNode(node);
                break;
            case 'timeNode':
                errorMessage = validateTimeNode(node);
                break;
            case 'muAns':
                errorMessage = validateMuAns(node);
                break;
            case 'reactNode':
                errorMessage = validateReactNode(node);
                break;
            case 'inputNode':
                errorMessage = validateInputNode(node);
                break;
            default:
                break;
        }

        if (errorMessage) {
            invalidNodes.set(node.type, errorMessage);
        }
    });

    edges.forEach(edge => {
        let errorMessage = null;

        switch (edge.source) {
            case 'muChoi':
                errorMessage = validateEdgeMuChoi(edge, edges);
                break;
            case 'endNode':
                errorMessage = validateEdgeEndNode(edge, edges);
                break;
            case 'bridgeNode':
                errorMessage = validateEdgeBridgeNode(edge, edges);
                break;
            case 'timeNode':
                errorMessage = validateEdgeTimeNode(edge, edges);
                break;
            case 'muAns':
                errorMessage = validateEdgeMuAns(edge, edges);
                break;
            case 'reactNode':
                errorMessage = validateEdgeReactNode(edge, edges);
                break;
            case 'inputNode':
                errorMessage = validateEdgeInputNode(edge, edges);
                break;
            case 'start':
                errorMessage = validateEdgeStart(edge, edges);
                break;
            default:
                break;
        }

        if (errorMessage) {
            invalidEdges.push([edge.source, errorMessage]);
        }
    });

    if (invalidNodes.size > 0 || invalidEdges.length > 0) {
        return false;
    } else {
        return true;
    }
};

export const uploadValidatedFlow = async (audiobookTitle, rfInstance, thumbnail, description, length, keywords, title) => {
    if (!rfInstance) return;

    const flow = rfInstance.toObject();
    try {
        const response = await axios.post('http://localhost:3005/saveValidatedFlow', {
            flow,
            flowKey: audiobookTitle,
            thumbnail: thumbnail,
            description: description,
            length: length,
            keywords: keywords,
            title: title,
        });
        if (response.status === 200) {
            console.log('ValidatedFlow successfully sent to the server.');
        } else {
            console.error('Error sendin flow to the server.');
        }
    } catch (error) {
        console.error('Error in try uploadValidateFlow:', error);
    }
}

export const getValidatedFlowTitle = async (title) => {
    try {
        const response = await axios.get('http://localhost:3005/getValidateFlowTitle', {
            params: {
                title: title
            }
        });
        return response.data.exists;
    } catch (error) {
        console.error('Error getting flow title validation:', error);
        return false;
    }
}

export const getThumbnailPath = async (audiobookTitle, graficName) => {
    try {
        const response = await axios.get('http://localhost:3005/getAudioName', {
            params: {
                audiobookTitle: audiobookTitle,
                audioName: graficName
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error getting Thumbnail path:', error);
        return;
    }
}

export const deleteUnusedAudio = async (audiobookTitle, audioUsage) => {
    try {
        for (const audioFile in audioUsage) {
            if (!audioUsage[audioFile]) {
                await handleFileDelete(audioFile, audiobookTitle);
            }
        }
    } catch (error) {
        console.error('Error deleting unused audio files:', error);
    }
}

const handleFileDelete = async (file, audiobookTitle) => {
    try {
        const response = await axios.post('http://localhost:3005/deleteFile', { file, audiobookTitle });
        console.log('File deleted successfully:', response.data);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

