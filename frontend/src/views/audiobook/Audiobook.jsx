import React, { useState, useEffect, useRef } from 'react';
import { Image, Link } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Player from '../player/Player';

import './audiobook.css';

import { fetchValidatedFlow } from '../../components/tasks/audiobookTasks/AudiobookFunctions';
import { handleGetDetails } from '../../components/tasks/setupTasks/FetchDetails';
import { fetchThumbnail, fetchThumbnailImage } from '../../components/tasks/publishTasks/PublishFunctions';

const Audiobook = () => {
    const [validatedFlow, setValidatedFlow] = useState({});
    const [flowDetails, setFlowDetails] = useState({});
    const [thumbnailImage, setThumbnailImage] = useState({});
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [descriptionHeight, setDescriptionHeight] = useState(9999);
    const descriptionRef = useRef(null);

    const { audiobookTitle } = useParams();

    useEffect(() => {
        const fetchFlow = async () => {
            try {
                const flowData = await fetchValidatedFlow(audiobookTitle);
                setValidatedFlow(flowData.validatedFlow);
            } catch (error) {
                console.error('Error fetching flow:', error);
            }
        };

        const getDetails = async () => {
            try {
                const details = await handleGetDetails(audiobookTitle);
                setFlowDetails(details);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };

        fetchFlow();
        getDetails();
    }, [audiobookTitle]);

    useEffect(() => {
        const fetchedThumbnail = async () => {
            if (validatedFlow && validatedFlow.thumbnail) {
                try {
                    const paths = await fetchThumbnail(validatedFlow.flowKey);
                    if (paths && paths.length > 0) {
                        const imageData = await fetchThumbnailImage(paths[0].audioPath);
                        setThumbnailImage(imageData);
                    }
                } catch (error) {
                    console.error('Error fetching thumbnail image: ', error);
                }
            }
        };
    
        fetchedThumbnail();
    }, [validatedFlow.thumbnail]);

    useEffect(() => {
        if (descriptionRef.current && !showFullDescription) {
            setDescriptionHeight(descriptionRef.current.clientHeight);
        }
    }, [descriptionRef, showFullDescription]);

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    console.log("validatedFlow, flowDetails:", validatedFlow, flowDetails);

    return (
        <div className='audiobook-wrapper'>
            <div className="details-image-container">
                <div className="image-container">
                    <Image
                        className='audiobook-image'
                        src={thumbnailImage}
                        alt={`Thumbnailimage-${validatedFlow.title || validatedFlow.flowKey}`}
                    />
                </div>
                <div className="details-container">
                    <h1>{validatedFlow.title || flowDetails.title} (2024)</h1>
                    <p><strong>Author:</strong> {flowDetails.author}</p>
                    <p><strong>Category:</strong> <Link to={`/category/${flowDetails.category}`}>{flowDetails.category}</Link></p>
                    {flowDetails.contributors && (
                        <p><strong>Contributors:</strong> {flowDetails.contributors.map(contributor => `${contributor.name} (${contributor.role})`).join(', ')}</p>
                    )}
                    <p><strong>Length:</strong> {validatedFlow.length}</p>
                    <p><strong>Number of Nodes:</strong> {validatedFlow.flowData && JSON.parse(validatedFlow.flowData).nodes.length}</p>
                    <div ref={descriptionRef} textAlign='left'>
                        <strong>Description:</strong>
                        {showFullDescription ? flowDetails.description : (flowDetails.description && flowDetails.description.slice(0, 150))}
                        {!showFullDescription && <button color='lightblue' onClick={handleToggleDescription}>... More</button>}
                        {showFullDescription && <button color='lightblue' onClick={handleToggleDescription}> Show less</button>}
                    </div>
                </div>
            </div>
            <div className="player-container">
                <Player />
            </div>
        </div>
    );
}

export default Audiobook;