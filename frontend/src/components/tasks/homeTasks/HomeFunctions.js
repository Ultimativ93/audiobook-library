import axios from 'axios'

// "HomeFunction.js" handles fetching all validated flows from the backend server and database.
// Its prior use is in the "Home" component.
export const handleGetAllValidatedFlows = async () => {
    try {
        const response = await axios.get('http://localhost:3005/getAllValidatedFlows');
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Error in fetching validated flows from the server.');
        }
    } catch (error) {
        console.error('Error in handleGetAllValidatedFlows', error);
        throw error;
    }
}