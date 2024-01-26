import { useState, useEffect } from 'react'
import axios from 'axios';

const FetchFlow = (flowKey) => {
    const [flow, setFlow] = useState([]);

    useEffect(() => {
        const fetchFlow = async () => {
            try {
                const response = await axios.get(`http://localhost:3005/getFlow`, { params: { flowKey } });
                setFlow(response.data);
            } catch (error) {
                console.error('Error fetching flow:', error);
            }
        };
    
        // Load function on component start
        fetchFlow();
    }, [flowKey]);
    
    console.log("Flow in FetchFlow: ", flow);
    return flow;
};

export default FetchFlow;