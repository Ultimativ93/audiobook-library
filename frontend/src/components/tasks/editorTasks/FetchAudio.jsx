import { useState, useEffect } from 'react';
import axios from 'axios';

const FetchAudio = () => {
    const [audioPaths, setAudioPaths] = useState([]);

    useEffect(() => {
        const fetchAudioPaths = async () => {
            try {
                const response = await axios.get('http://localhost:3005/audioPaths');
                setAudioPaths(response.data);
            } catch (error) {
                console.error('Error fetching audio paths:', error);
            }
        };

        // Load function on component start
        fetchAudioPaths();
    }, []);

    return audioPaths;
};

export default FetchAudio;
