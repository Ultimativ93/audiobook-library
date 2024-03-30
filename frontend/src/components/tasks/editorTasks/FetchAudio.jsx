import axios from 'axios';

// "FetchAudio.jsx" fetches audio with a flowKey from the backend server and database.
// FetchAudio is used in the "Editor", "Player" and the "LayoutModalUpload" component.
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