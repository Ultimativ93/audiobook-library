import axios from "axios";

// Here we have to get user.id later, to get the flows for the user.id
const FetchFlows = async () => {
    try {
        const response = await axios.get('http://localhost:3005/getAllDetails');
        if (response.status === 200) {
            return response.data;
        } else {
            console.warn('No flows found in the database, FetchFlows');
            return null;
        }
    } catch (error) {
        console.error('Error fetching flows from the database', error);
        return null;
    }
};

export default FetchFlows;