import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchAudio = () => {
    const [audioPaths, setAudioPaths] = useState([]);
    console.log("Fetch Audio, audiopaths: ", audioPaths)

    useEffect(() => {
        console.log("Fetch Audio useEffect")
        const fetchAudioPaths = async () => {
            try {
                const response = await axios.get('http://localhost:3005/audioPaths');
                console.log('Response data:', response.data);
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
