import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Select } from '@chakra-ui/react';
import { DeleteIcon, ArrowRightIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';

import '../layoutMenuModalUpload/layout-menu-modal-upload.css';

import { handleUpload, handleFileDelete, fetchAudioUrl, fetchGraphicUrl, changeCategory } from "../../../../../tasks/uploadTasks/UploadTasks";
import { useAudioUsage } from '../../../../layoutDrawer/LayoutDrawerFunctions';

const LayoutMenuModalUpload = ({ isModalUploadOpen, setModalsState, audiobookTitle }) => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [projectFiles, setProjectFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [sortBy, setSortBy] = useState('byName');
    const [audioUrls, setAudioUrls] = useState([]);
    const [showAudio, setShowAudio] = useState(false);
    const [graphicUrls, setGraphicUrls] = useState([]);
    const [showGraphic, setShowGraphic] = useState(false);
    const [category, setCategory] = useState('universal');

    const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg'],
            'audio/mpeg': ['.mpeg'],
            'audio/mp3': ['.mp3'],
            'audio/aac': ['.aac'],
            'audio/ogg': ['.ogg'],
            'audio/m4a': ['.m4a'],
        },
        maxFiles: 30,
        onDropAccepted: () => setUploadSuccess(false),
        onDropRejected: () => setUploadSuccess(false),
    });

    const handleButtonClick = () => {
        handleUpload(acceptedFiles, audiobookTitle, category, setUploadSuccess);
    }

    const handleFileClick = async (file) => {
        if (selectedFiles.includes(file)) {
            setSelectedFiles(selectedFiles.filter(f => f !== file));
        } else {
            setSelectedFiles([...selectedFiles, file]);
        }
    }

    const handleDeleteSelectedFiles = () => {
        selectedFiles.forEach(file => {
            handleFileDelete(file, audiobookTitle, setProjectFiles);
        });
        setSelectedFiles([]);
        setAudioUrls([]);
        setShowAudio(false);
        setShowGraphic(false);
    }

    const sortFiles = (files) => {
        const sortedFiles = [...files];
        if (sortBy === 'byName') {
            sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'byDataType') {
            sortedFiles.sort((a, b) => {
                const extA = a.name.split('.').pop();
                const extB = b.name.split('.').pop();
                return extA.localeCompare(extB);
            });
        } else if (sortBy === 'byCategory') {
            sortedFiles.sort((a, b) => {
                if (a.category === b.category) {
                    return a.name.localeCompare(b.name);
                } else {
                    return a.category.localeCompare(b.category);
                }
            });
        }
        return sortedFiles;
    };

    const handlePlayClick = () => {
        if (showAudio) {
            setShowAudio(false);
        } else {
            const audioFiles = selectedFiles.filter(file => file.endsWith('.mp3') || file.endsWith('.aac') || file.endsWith('.wav') || file.endsWith('.ogg') || file.endsWith('.m4a'));
            if (audioFiles.length === 1) {
                setShowAudio(true);
                setShowGraphic(false);
                fetchAudioUrl(audioFiles[0], (audioUrl) => setAudioUrls([audioUrl]));
            } else if (audioFiles.length === 0) {
                alert("Please select an audio file to play.");
            } else {
                alert("Please select only one audio file to play.");
            }
        }
    }

    const handleShowGraphic = () => {
        if (showGraphic) {
            setShowGraphic(false);
        } else {
            const graphicFiles = selectedFiles.filter(file => file.endsWith('.png') || file.endsWith('.PNG') || file.endsWith('.jpg') || file.endsWith('.JPG') || file.endsWith('.jpeg') || file.endsWith('.jpeg'));
            if (graphicFiles.length === 1) {
                setShowGraphic(true);
                setShowAudio(false);
                fetchGraphicUrl(graphicFiles[0], (graphicUrl) => setGraphicUrls([graphicUrl]));
            } else if (graphicFiles.length === 0) {
                alert("Please select a graphic file to display.");
            } else {
                alert("Please select only one graphic file to display.");
            }
        }

    }

    const handleCategoryChange = (file, selectedCategory) => {
        console.log("File, selectedCategory", file, selectedCategory);
        const updatedProjectFiles = projectFiles.map(item => {
            if (item.name === file.name) {
                return { ...item, category: selectedCategory };
            }
            return item;
        });
        changeCategory(file.name, selectedCategory, audiobookTitle);
        setProjectFiles(updatedProjectFiles);
    };

    const audioUsage = useAudioUsage(projectFiles.map(file => ({ audioName: file.name })));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3005/getDataFromFlow?flowKey=${audiobookTitle}`);
                const data = response.data;
                if (category === 'universal') {
                    setProjectFiles(sortFiles(data));
                } else {
                    setProjectFiles(sortFiles(data.filter(file => file.category === category)));
                }
            } catch (error) {
                console.error('Error fetching data with flowkey: ', error);
            }
        };

        fetchData();
    }, [audiobookTitle, uploadSuccess, category]);

    useEffect(() => {
        if (uploadSuccess) {
            setSelectedFiles([]);
        }
    }, [uploadSuccess]);

    useEffect(() => {
        setProjectFiles(files => sortFiles(files));
    }, [sortBy]);

    return (
        <Modal isOpen={isModalUploadOpen} size='5xl' onClose={() => setModalsState(prevState => ({ ...prevState, isUploadModalOpen: false }))}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Media Manager</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className="layout-menu-modal-upload-wrapper">
                        <div className="layout-menu-modal-upload-left">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <div className='layout-menu-modal-upload-dropzone'>
                                    <p>Drag some files here, or click to select files.</p>
                                    <DownloadIcon style={{ fontSize: 64, color: 'white', marginLeft: '10px' }} />
                                </div>
                            </div>
                            {uploadSuccess ? (
                                <p style={{ color: 'black', fontWeight: 'bold', marginTop: '20px' }}>Your files have been successfully uploaded to the server!</p>
                            ) : (
                                <aside>
                                    <p style={{ color: 'black', fontSize: '18px', marginTop: '10px', textDecoration: 'underline' }}>Files</p>
                                    <ul>
                                        {acceptedFiles.map((file, index) => (
                                            <li key={index}>
                                                <span style={{ color: 'black', marginRight: '10px' }}>{file.name}</span>
                                                <span style={{ color: 'black' }}>{file.size} bytes</span>
                                                <Select size="sm" value={file?.category} onChange={(e) => handleCategoryChange(file, e.target.value)} focusBorderColor="darkButtons">
                                                    <option value="universal">Universal</option>
                                                    <option value="question">Question Audio</option>
                                                    <option value="story">Story Audio</option>
                                                    <option value="interaction">Interaction Signal Audio</option>
                                                    <option value="background">Background Audio</option>
                                                    <option value="answer">Answer Audio</option>
                                                </Select>
                                                {audioUsage[file.name] ? <span style={{ color: 'green', marginLeft: '10px' }}>✓</span> : null}
                                            </li>
                                        ))}
                                    </ul>
                                    <p style={{ color: 'black', fontSize: '18px', marginTop: '10px', textDecoration: 'underline' }}>Rejected files:</p>
                                    <ul style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                                        {fileRejections.map(({ file, errors }) => (
                                            <li key={file.path}>
                                                <span style={{ color: 'black', marginRight: '10px', marginTop: '10px' }}>{file.path}</span>
                                                <span style={{ color: 'black' }}>{file.path} - {file.size} bytes</span>
                                                <ul>
                                                    {errors.map(e => (
                                                        <p key={e.code} style={{ color: '#E53E3E', marginLeft: '25px', marginTop: '5px' }}>{e.message}</p>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>

                                </aside>
                            )}
                            {acceptedFiles.length !== 0 && !uploadSuccess && (<Button colorScheme='highlightColor' onClick={handleButtonClick}>Upload</Button>)}
                        </div>

                        <div className="layout-menu-modal-upload-right-wrapper">
                            <div className="layout-menu-modal-upload-right">
                                <div className="layout-menu-modal-upload-right-buttons">
                                    <div className="layout-menu-modal-upload-right-buttons-left">
                                        <Button size='sm' colorScheme='darkButtons' leftIcon={<DeleteIcon />} onClick={handleDeleteSelectedFiles} />
                                        {showAudio && (
                                            <Button size='sm' colorScheme='darkButtons' leftIcon={<ArrowRightIcon />} onClick={handlePlayClick}>
                                                Hide Audio
                                            </Button>
                                        )}
                                        {!showAudio && (
                                            <Button size='sm' colorScheme='darkButtons' leftIcon={<ArrowRightIcon />} onClick={handlePlayClick}>
                                                Play Audio
                                            </Button>
                                        )}
                                        {showGraphic && (<Button size='sm' colorScheme='darkButtons' leftIcon={<ViewIcon />} onClick={handleShowGraphic}>
                                            Hide Graphic
                                        </Button>)}
                                        {!showGraphic && (<Button size='sm' colorScheme='darkButtons' leftIcon={<ViewIcon />} onClick={handleShowGraphic}>
                                            Show Graphic
                                        </Button>)}
                                    </div>
                                    <div className="layout-menu-modal-upload-right-buttons-right">
                                        <Select size='sm' placeholder="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} focusBorderColor='darkButtons'>
                                            <option value='byName'>Sort By Name</option>
                                            <option value='byDataType'>Sort By Data Type</option>
                                            <option value='byCategory'>Sort by Category</option>
                                        </Select>
                                        <Select size='sm' value={category} onChange={(e) => setCategory(e.target.value)} focusBorderColor='darkButtons'>
                                            <option value="universal">Universal</option>
                                            <option value="question">Question Audio</option>
                                            <option value="story">Story Audio</option>
                                            <option value="interaction">Interaction Signal Audio</option>
                                            <option value="background">Background Audio</option>
                                            <option value="answer">Answer Audio</option>
                                        </Select>
                                    </div>
                                </div>
                                <hr />
                                <div className="layout-menu-modal-upload-right-content">
                                    {projectFiles
                                        .filter(file => category === 'universal' || file.category === category)
                                        .map((file, index) => (
                                            <div key={index} className="file-item" style={{ backgroundColor: selectedFiles.includes(file) ? '#bfbfbf' : (audioUsage[file.name] ? '#C6F6D5' : 'transparent'), display: 'flex', alignItems: 'center' }}>
                                                <p onClick={() => handleFileClick(file)} style={{ marginRight: '10px', flex: '1' }}>
                                                    {file.name}
                                                    {audioUsage[file.name] ? <span style={{ color: 'green', marginLeft: '10px' }}>✓</span> : null}
                                                </p>
                                                <div style={{ marginLeft: 'auto', width: '150px' }}>
                                                    <Select size="sm" value={file.category || 'universal'} onChange={(e) => handleCategoryChange(file, e.target.value)} focusBorderColor="darkButtons">
                                                        <option value="question">Question Audio</option>
                                                        <option value="story">Story Audio</option>
                                                        <option value="interaction">Interaction Signal Audio</option>
                                                        <option value="background">Background Audio</option>
                                                        <option value="answer">Answer Audio</option>
                                                        <option value="universal">Universal</option>
                                                        <option value="answerProcessAudio">Answer Process Audio</option>
                                                    </Select>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="layout-menu-modal-upload-right-player">
                                {showAudio && audioUrls.map((audioUrl, index) => (
                                    audioUrl && (
                                        <audio key={index} controls>
                                            <source src={audioUrl} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )
                                ))}

                                {showGraphic && graphicUrls.map((graphicUrl, index) => (
                                    graphicUrl && (
                                        <img key={index} src={graphicUrl} alt="Graphic" />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default LayoutMenuModalUpload;