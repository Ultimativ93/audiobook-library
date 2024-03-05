import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Select, Input } from '@chakra-ui/react';

import './layout-menu-modal-publish.css';

import LinkUpload from '../../../../layoutDrawer/drawerComponents/LinkUpload';
import LinkSetup from '../../layoutMenuComponents/LinkSetup';

import { handleGetDetails, handleChangeDetails } from '../../../../../tasks/setupTasks/FetchDetails';
import { fetchThumbnail, fetchThumbnailImage, validateNodesAndEdges, uploadValidatedFlow, getValidatedFlowTitle } from '../../../../../tasks/publishTasks/PublishFunctions';

const LayoutMenuModalPublish = ({ isPublishModalOpen, setModalsState, audiobookTitle, nodes, edges, rfInstance }) => {
    const [publishData, setPublishData] = useState({ thumbnail: '', description: '' });
    const [graficPaths, setGraficPaths] = useState([]);
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [isDescriptionTooLong, setIsDescriptionTooLong] = useState(false);
    const [validated, setValidated] = useState(false);
    const [keywordValidation, setKeywordValidation] = useState(false);
    const [isWrongTitle, setIsWrongTitle] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedThumbnails = await fetchThumbnail(audiobookTitle);
                setGraficPaths(fetchedThumbnails);
                
                const details = await handleGetDetails(audiobookTitle);
                if (details) {
                    if (details.thumbnail) {
                        setPublishData({ ...publishData, thumbnail: details.thumbnail });
                    }
                }
            } catch (error) {
                console.error('Error fetching thumbnails or details.', error);
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
    }, [publishData.thumbnail, graficPaths]);

    useEffect(() => {
        setValidated(false);
    }, [publishData]);

    const handleInputChange = async (e, type) => {
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
        } else if (type === 'keywords') {
            const value = e.target.value;
            setPublishData({ ...publishData, keywords: value });
            const keywordsArray = value.split(',').map(keyword => keyword.trim());
            if (keywordsArray.length >= 5) {
                setKeywordValidation(false);
            } else {
                setKeywordValidation(true);
            }
        } else if (type === 'length') {
            const value = e.target.value;
            setPublishData({ ...publishData, length: value})
        } else if (type === 'title') {
            const value = e.target.value;
            const titleExists = await getValidatedFlowTitle(value);
            setIsWrongTitle(titleExists);
            setPublishData({ ...publishData, title: value });
        }
    }

    const handleSubmit = () => {
        if (!publishData.thumbnail) {
            alert('Please select a thumbnail');
            return;
        }

        if (!publishData.description) {
            alert('Please set a description');
            return;
        }

        if (!publishData.length) {
            alert('Please set a approximately length');
            return;
        }

        if (!publishData.keywords) {
            alert('Please set at leat 5 keywords');
            return;
        }

        const isValidated = validateNodesAndEdges(nodes, edges);

        if (!isValidated) {
            alert('Please check the validation of your Audiobook in "Preview".')
            return;
        }

        if (publishData.thumbnail && publishData.description && publishData.length && publishData.keywords && isValidated) {
            uploadValidatedFlow(audiobookTitle, rfInstance, publishData.thumbnail, publishData.description, publishData.length, publishData.keywords, publishData.title);
            setValidated(true);
        }
    }

    //console.log("PublishData", publishData);
    //console.log("graficPaths", graficPaths);

    return (
        <Modal isOpen={isPublishModalOpen} onClose={() => setModalsState(prevState => ({ ...prevState, isPublishModalOpen: false }))} size="5xl">
            <ModalOverlay />
            <ModalContent className="modal-content">
                <ModalCloseButton />
                <ModalHeader>Publish Audiobook: {publishData.title ? publishData.title : audiobookTitle}</ModalHeader>
                <ModalBody className="modal-body">
                    <div className="modal-publish-title">
                        <h4>Set a title if you want a different title than your project title:</h4>
                        <Input 
                            type="text"
                            placeholder='Set Audiobook Title..'
                            value={publishData.title}
                            onChange={(e) => handleInputChange(e, 'title')}
                            borderColor={isWrongTitle ? 'red' : 'inherit'}
                        />
                        {isWrongTitle && <p style={{ color: 'red' }}>The title is already used, or it has the wrong format.</p>}
                    </div>

                    <div className="modal-publish-thumbnail-container">
                        <h4>Select Thumbnail:</h4>
                        <Select
                            placeholder='Select Thumbnail..'
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
                        <h4>Set Short Description:</h4>
                        <Input
                            type="text"
                            placeholder="Description.."
                            value={publishData.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                            borderColor={isDescriptionTooLong ? 'red' : 'inherit'}
                        />
                        {isDescriptionTooLong && <p style={{ color: 'red' }}>Description is too long (max 80 characters)</p>}
                    </div>

                    <div className="modal-publish-keywords">
                        <h4>Set keywords for your audiobook:</h4>
                        <Input
                            type="text"
                            placeholder="Keywords.."
                            value={publishData.keywords}
                            onChange={(e) => handleInputChange(e, 'keywords')}
                        />
                        {keywordValidation && <p style={{ color: 'red'}}>Enter at least 5 keywords (separated with ",").</p>}
                    </div>

                    <div className="modal-publish-audiobook-length">
                        <h4>Set approximate length of audiobook:</h4>
                        <Input
                            type="number"
                            placeholder="Approximate length in minutes.."
                            value={publishData.length}
                            onChange={(e) => handleInputChange(e, 'length')}
                        />
                    </div>

                    <div className="modal-publish-preview">
                        {thumbnailImage && <img src={thumbnailImage} alt="Thumbnail" />}
                        <div className="audiobook-info">
                            <h5>Title: {publishData.title ? publishData.title : audiobookTitle}</h5>
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
