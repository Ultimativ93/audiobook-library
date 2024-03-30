import axios from "axios";

// "FetchDetails" fetches all details from the backend and provides it to the "UserProjects" view component.
// Its main use is in "UserProjects", to showcase the data for the creator.
const FetchDetails = async () => {
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

export default FetchDetails;