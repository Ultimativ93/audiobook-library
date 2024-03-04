import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Select, Input } from '@chakra-ui/react';

import './layout-menu-modal-publish.css';

import LinkUpload from '../../../../layoutDrawer/drawerComponents/LinkUpload';
import LinkSetup from '../../layoutMenuComponents/LinkSetup';

import { fetchThumbnail, fetchThumbnailImage, validateNodesAndEdges, uploadValidatedFlow } from '../../../../../tasks/publishTasks/PublishFunctions';

const LayoutMenuModalPublish = ({ isPublishModalOpen, setModalsState, audiobookTitle, nodes, edges, rfInstance }) => {
    const [publishData, setPublishData] = useState({ thumbnail: '', description: '' });
    const [graficPaths, setGraficPaths] = useState([]);
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [isDescriptionTooLong, setIsDescriptionTooLong] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedThumbnails = await fetchThumbnail(audiobookTitle);
                setGraficPaths(fetchedThumbnails);
            } catch (error) {
                console.error('Error fetching thumbnails.', error);
            }
        };

        fetchData();
    }, [audiobookTitle]);

    useEffect(() => {
        const fetchImage = async () => {
            if (publishData.thumbnail) {
                try {
                    const selectedGraphic = graficPaths.find(graphic => graphic.audioName === publishData.thumbnail);
                    if (selectedGraphic) {
                        const imageData = await fetchThumbnailImage(selectedGraphic.audioPath);
                        setThumbnailImage(imageData);
                    } else {
                        console.error('Selected graphic not found in graficPaths.');
                    }
                } catch (error) {
                    console.error('Error fetching thumbnail image.', error);
                }
            } else {
                setThumbnailImage(null);
            }
        };

        fetchImage();
    }, [publishData.thumbnail]);

    useEffect(() => {
        setValidated(false);
    }, [publishData])

    const handleInputChange = (e, type) => {
        if (type === 'thumbnailGrafic') {
            const value = e.target.value;
            setPublishData({ ...publishData, thumbnail: value });
        } else if (type === 'description') {
            const value = e.target.value;
            if (value.length <= 80) {
                setPublishData({ ...publishData, description: value });
                setIsDescriptionTooLong(false);
            } else {
                setIsDescriptionTooLong(true);
            }
        }
    }

    const handleSubmit = () => {
        if (!publishData.thumbnail || !publishData.description) {
            alert('Please select a thumbnail and set a description.')
            return;
        }
    
        const isValidated = validateNodesAndEdges(nodes, edges);
    
        if (!isValidated) {
            alert('Please check the validation of your Audiobook in "Preview".')
            return;
        }

        if (publishData.thumbnail && publishData.description && isValidated) {
            uploadValidatedFlow(audiobookTitle, rfInstance, publishData.thumbnail, publishData.description);
            setValidated(true);
        }
    }

    console.log("PublishData", publishData);
    console.log("graficPaths", graficPaths);

    return (
        <Modal isOpen={isPublishModalOpen} onClose={() => setModalsState(prevState => ({ ...prevState, isPublishModalOpen: false }))} size="5xl">
            <ModalOverlay />
            <ModalContent className="modal-content">
                <ModalCloseButton />
                <ModalHeader>Publish Audiobook: {audiobookTitle}</ModalHeader>
                <ModalBody className="modal-body">
                    <div className="modal-publish-thumbnail-container">
                        <h4>Select Thumbnail</h4>
                        <Select
                            placeholder='Select Thumbnail'
                            size='md'
                            width='300px'
                            value={publishData.thumbnail}
                            onChange={(e) => handleInputChange(e, 'thumbnailGrafic')}
                        >
                            {graficPaths.map((grafic, index) => (
                                <option key={index} value={grafic.audioName}>
                                    {grafic.audioName}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="modal-publish-description">
                        <h4>Set Short Description</h4>
                        <Input
                            type="text"
                            placeholder="Description"
                            value={publishData.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                            borderColor={isDescriptionTooLong ? 'red' : 'inherit'}
                        />
                        {isDescriptionTooLong && <p style={{ color: 'red' }}>Description is too long (max 80 characters)</p>}
                    </div>

                    <div className="modal-publish-preview">
                        {thumbnailImage && <img src={thumbnailImage} alt="Thumbnail" />}
                        <div className="audiobook-info">
                            <h5>Title: {audiobookTitle}</h5>
                            <p>{publishData.description}</p>
                        </div>
                    </div>

                    <div className="modal-publish-links">
                        <LinkUpload />
                        <LinkSetup />
                    </div>

                    <div className="modal-publish-submit">
                        <Button colorScheme='blue' onClick={() => handleSubmit()}>Submit</Button>
                        <Button colorScheme='red'>Cancel</Button>
                    </div>
                    {validated && (
                        <p>Flow successfully submitted!</p>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default LayoutMenuModalPublish;
