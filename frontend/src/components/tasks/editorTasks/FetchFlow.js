import axios from "axios"

// "FetchFlow.js" is used to the a flow with an audiobook title from the backend server and database.
// Its prior use is to fetch flows for the "Editor", "Player", "Audiobook" components.
const fetchFlow = async (audiobookTitle) => {
    try {
        const response = await axios.get(`http://localhost:3005/getFlow?flowKey=${audiobookTitle}`)
        if(response.status === 200) {
            const flow = response.data;
            return flow;
        } else {
            console.warn('No flow found on the server');
            return false;
        }
    } catch (error) {
        console.error('Error fetching flow from the server');
    }
}

export {
    fetchFlow,
}