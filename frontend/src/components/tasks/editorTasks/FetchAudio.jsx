import axios from 'axios';

const FetchAudio = async (flowKey) => {
    try {
        const response = await axios.get('http://localhost:3005/audioPaths', {
            params: {
                audiobookTitle: flowKey
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching audio paths:', error);
        return [];
    }
};

export default FetchAudio;