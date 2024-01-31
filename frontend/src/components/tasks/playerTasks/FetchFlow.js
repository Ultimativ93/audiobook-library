import axios from 'axios';

const fetchFlow = async (flowKey) => {
  try {
    const response = await axios.get(`http://localhost:3005/getFlow?flowKey=${flowKey}`);
    
    if (response.status === 200) {
      return response.data;
    } else {
      console.warn('No flow found in the database, FetchFlow');
      return null;
    }
  } catch (error) {
    console.error('Error fetching flow from the database', error);
    return null;
  }
};

export default fetchFlow;
