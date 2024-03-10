import React, { useState, useEffect } from 'react';
import { Image } from '@chakra-ui/react';
import { useFetcher, useParams } from 'react-router-dom';

import './audiobook.css';

import { fetchValidatedFlow } from '../../components/tasks/audiobookTasks/AudiobookFunctions';
import { handleGetDetails } from '../../components/tasks/setupTasks/FetchDetails';
import { fetchThumbnail, fetchThumbnailImage } from '../../components/tasks/publishTasks/PublishFunctions';
import Player from '../player/Player';

const Audiobook = () => {
    const [validatedFlow, setValidatedFlow] = useState({});
    const [flowDetails, setFlowDetails] = useState({});
    const [thumbnailImage, setThumbnailImage] = useState({});

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

    console.log("validatedFlow, flowDetails:", validatedFlow, flowDetails);

    return (
        <div className='audiobook-wrapper'>
            <div className="details-image-container">
                <div className="details-container">
                    <h2>Audiobook Details</h2>
                    <ul>
                        <li>
                            <strong>Title:</strong> {flowDetails.title}
                        </li>
                        <li>
                            <strong>Author:</strong> {flowDetails.author}
                        </li>
                        <li>
                            <strong>Category:</strong> {flowDetails.category}
                        </li>
                        <li>
                            <strong>Description:</strong> {flowDetails.description}
                        </li>
                        {flowDetails.contributors && (
                            <li>
                                <strong>Contributors:</strong> {flowDetails.contributors.map(contributor => `${contributor.name} (${contributor.role})`).join(', ')}
                            </li>
                        )}
                        <li>
                            <strong>Length:</strong> {validatedFlow.length}
                        </li>
                        <li>
                            <strong>Number of Nodes:</strong> {validatedFlow.flowData && JSON.parse(validatedFlow.flowData).nodes.length}
                        </li>
                    </ul>
                </div>
                <div className="image-container">
                    <Image
                        className='audiobook-image'
                        src={thumbnailImage}
                        alt={`Thumbnailimage-${validatedFlow.title || validatedFlow.flowKey}`}
                    />
                </div>
            </div>
            <div className="player-container">
                <Player />
            </div>
        </div>
    );
}

export default Audiobook;
