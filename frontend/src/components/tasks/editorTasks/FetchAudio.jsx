import { useState, useEffect } from 'react';
import axios from 'axios';

const FetchAudio = (flowKey) => {
    const [audioPaths, setAudioPaths] = useState([]);

    useEffect(() => {
        const fetchAudioPaths = async () => {
            try {
                const response = await axios.get('http://localhost:3005/audioPaths', {
                    params: {
                        audiobookTitle: flowKey
                    }
                });
                setAudioPaths(response.data);
            } catch (error) {
                console.error('Error fetching audio paths:', error);
            }
        };

        fetchAudioPaths();
    }, [flowKey]);

    return audioPaths;
};


export default FetchAudio;
