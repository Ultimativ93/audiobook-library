import axios from 'axios';

// Audiobook tasked has the main task of fetching a validated flow from the backend.
export const fetchValidatedFlow = async (audiobookTitle) => {
    try {
        const response = await axios.get(`http://localhost:3005/getValidatedFlow?title=${audiobookTitle}`)
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Error in fetching validated flow from the server.');
        }
    } catch (error) {
        console.error('Error in fetchValidatedFlow', error);
        throw error;
    }
}

