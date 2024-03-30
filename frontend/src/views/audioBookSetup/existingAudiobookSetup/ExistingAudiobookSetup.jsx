import React, { useState, useEffect } from 'react';
import { Input, Button, Stack, Checkbox, Textarea, Select, Flex } from '@chakra-ui/react';

import './existing-audiobook-setup.css';

import {
    handleInputChange,
    handleCheckBoxChange,
    handleInputChangeSecondLevel,
    handleAddContributor,
    handleRemoveContributor,
    handleCheckSetup
} from '../../../components/tasks/setupTasks/SetupFunctions';

import { handleChangeDetails } from '../../../components/tasks/setupTasks/FetchDetails';
import { fetchThumbnailImage, getThumbnailPath, fetchAllGraphicNames } from '../../../components/tasks/publishTasks/PublishFunctions';

// ExistingAudiobookSetup accessed from the user projects tab, will handle and existing audiobook setup, and allow the user to input information data for the preview in Audiobook.jsx
const ExistingAudiobookSetup = ({ existingAudiobookDetails, setExistingAudiobookDetails, setModalsState, audiobookTitle }) => {
    const [graficPaths, setGraficPaths] = useState([]);
    const [thumbnailImage, setThumbnailImage] = useState(null);

    const isFieldEmpty = (field) => {
        return field === 'string' && field.trim() === '';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedThumbnails = await fetchAllGraphicNames(audiobookTitle);
                setGraficPaths(fetchedThumbnails);
            } catch (error) {
                console.error('Error fetching thumbnails.', error);
            }
        };
        
        fetchData();
    }, [audiobookTitle]);

    useEffect(() => {
        const fetchImage = async () => {
            if (graficPaths.length > 0 && existingAudiobookDetails.thumbnail) {
                try {
                    const selectedGraphic = graficPaths.find(graphic => graphic.audioName === existingAudiobookDetails.thumbnail);
                    if (selectedGraphic) {
                        const thumbnailPath = await getThumbnailPath(audiobookTitle, selectedGraphic.audioName);
                        const imageData = await fetchThumbnailImage(thumbnailPath);
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
    }, [existingAudiobookDetails.thumbnail, graficPaths]);

    return (
        <>
            {existingAudiobookDetails && (
                <div className='audiobook-setup-contents' style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div className='audiobook-setup-contents-inputs' style={{ marginBottom: '20px' }}>
                        <p>Audiobook Title</p>
                        <Input
                            placeholder='Audiobook Title ..'
                            size='md'
                            width="50%"
                            value={existingAudiobookDetails?.title}
                            readOnly={true}
                            borderColor={isFieldEmpty(existingAudiobookDetails.title) ? 'red' : 'default'}
                            marginBottom='10px'
                            focusBorderColor='darkButtons'
                        />

                        <p>Audiobook Description</p>
                        <Textarea
                            placeholder='Audiobook Description ..'
                            size='md'
                            width='100%'
                            value={existingAudiobookDetails?.description}
                            onChange={(e) => handleInputChange(e.target.value, 'description', existingAudiobookDetails, setExistingAudiobookDetails)}
                            resize='vertical'
                            borderColor={isFieldEmpty(existingAudiobookDetails) ? 'red' : 'default'}
                            style={{ marginBottom: '10px' }}
                            focusBorderColor='darkButtons'
                        />

                        <p>Author</p>
                        <Input
                            placeholder='Author ..'
                            size='md'
                            width="50%"
                            value={existingAudiobookDetails?.author}
                            onChange={(e) => handleInputChange(e.target.value, 'author', existingAudiobookDetails, setExistingAudiobookDetails)}
                            borderColor={isFieldEmpty(existingAudiobookDetails.author) ? 'red' : 'default'}
                            style={{ marginBottom: '10px' }}
                            focusBorderColor='darkButtons'
                        />

                        <p>Select Thumbnail</p>
                        <Select
                            placeholder='Select Thumbnail..'
                            value={existingAudiobookDetails.thumbnail}
                            onChange={(e) => handleInputChange(e.target.value, 'thumbnail', existingAudiobookDetails, setExistingAudiobookDetails)}
                            size='md'
                            width='50%'
                            style={{ marginBottom: '10px' }}
                            focusBorderColor='darkButtons'
                        >
                            {graficPaths.map((grafic, index) => (
                                <option key={index} value={grafic.audioName}>
                                    {grafic.audioName}
                                </option>
                            ))}
                        </Select>
                        {thumbnailImage && (
                            <img style={{ width: '200px', height: '200px', marginBottom: '10px' }} src={thumbnailImage} alt={`Thumbnail-${audiobookTitle}`} />
                        )}

                        <p>Choose Input Selection</p>
                        <Stack direction="row" flexWrap="wrap" style={{ marginBottom: '10px' }}>
                            {existingAudiobookDetails.inputSelections && Object.keys(existingAudiobookDetails.inputSelections).map((key, index) => (
                                <Checkbox
                                    key={index}
                                    isChecked={existingAudiobookDetails?.inputSelections[key]}
                                    onChange={() => handleCheckBoxChange(key, existingAudiobookDetails, setExistingAudiobookDetails)}
                                    colorScheme='darkButtons'
                                >
                                    {key}
                                </Checkbox>
                            ))}
                        </Stack>

                        <div className="audiobook-setup-contents-contributors" style={{ marginBottom: '10px' }}>
                            <p>Contributors</p>
                            {existingAudiobookDetails?.contributors && existingAudiobookDetails.contributors.map((contributor, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <Flex alignItems="center">
                                        <Select
                                            placeholder='Select Role ..'
                                            value={contributor?.role}
                                            width='200px'
                                            onChange={(e) => handleInputChangeSecondLevel(e.target.value, `contributors.role.${index}`, setExistingAudiobookDetails)}
                                            style={{ marginRight: '10px' }}
                                            focusBorderColor='darkButtons'
                                        >
                                            <option>Producer</option>
                                            <option>Speaker</option>
                                            <option>Editor</option>
                                            <option>Writer</option>
                                        </Select>

                                        <Input
                                            placeholder={`Name ..`}
                                            size='md'
                                            width='200px'
                                            value={contributor?.name}
                                            onChange={(e) => handleInputChangeSecondLevel(e.target.value, `contributors.name.${index}`, setExistingAudiobookDetails)}
                                            borderColor={isFieldEmpty(contributor.name) ? 'red' : 'default'}
                                            style={{ marginRight: '10px' }}
                                            focusBorderColor='darkButtons'
                                        />
                                        <Button
                                            colorScheme='darkButtons'
                                            onClick={() => handleRemoveContributor(index, setExistingAudiobookDetails)}
                                            style={{ marginRight: '10px' }}
                                        >X</Button>
                                    </Flex>
                                </div>
                            ))}
                            <Button
                                colorScheme='highlightColor'
                                onClick={() => handleAddContributor(setExistingAudiobookDetails)}
                                style={{ marginBottom: '10px' }}
                            >
                                Add Contributor
                            </Button>
                        </div>

                        <p>Category</p>
                        <Select
                            placeholder='Select Category .. '
                            value={existingAudiobookDetails?.category}
                            width='200px'
                            onChange={(e) => handleInputChange(e.target.value, 'category', existingAudiobookDetails, setExistingAudiobookDetails)}
                            borderColor={isFieldEmpty(existingAudiobookDetails.category) ? 'red' : 'default'}
                            style={{ marginBottom: '10px' }}
                            focusBorderColor='darkButtons'
                        >
                            <option>Biographies</option>
                            <option>Business and Career</option>
                            <option>Childrens and Yound Adults</option>
                            <option>Fantasy</option>
                            <option>Historical Fiction</option>
                            <option>Mysteries</option>
                            <option>Novels</option>
                            <option>Science Fiction</option>
                            <option>Self-Help</option>
                            <option>Thrillers</option>
                            <option>Romance</option>
                            <option>Horror</option>
                            <option>Comedy</option>
                            <option>Poetry</option>
                        </Select>
                    </div>
                    <div className='audiobook-setup-contents-buttons'>
                        <Button colorScheme='highlightColor' onClick={() => {
                            if (existingAudiobookDetails) {
                                const isAudiobook = handleCheckSetup(existingAudiobookDetails)
                                if (isAudiobook) {
                                    const detailsSaved = handleChangeDetails(isAudiobook);
                                    if (detailsSaved) {
                                        setModalsState(false);
                                    } else {
                                        alert("Something went wrong. Try again please or contact support!")
                                    }
                                }
                            }
                        }}>Continue Editing</Button>
                        <Button colorScheme='darkButtons' onClick={() => setModalsState(false)} marginLeft='10px' >Cancel</Button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ExistingAudiobookSetup;
