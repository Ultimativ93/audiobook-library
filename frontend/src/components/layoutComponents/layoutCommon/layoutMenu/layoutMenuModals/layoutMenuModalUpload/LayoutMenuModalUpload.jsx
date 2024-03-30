import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, Button, Select, IconButton, Input } from '@chakra-ui/react';
import { DeleteIcon, ArrowRightIcon, ViewIcon, DownloadIcon, EditIcon } from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';

import '../layoutMenuModalUpload/layout-menu-modal-upload.css';

import { handleUpload, handleFileDelete, fetchAudioUrl, fetchGraphicUrl, changeCategory, sortFiles, handleChangeName, handleChangeNameInDetails } from '../../../../../tasks/uploadTasks/UploadTasks';
import { useAudioUsage } from '../../../../../tasks/drawerTasks/LayoutDrawerFunctions';
import { getAudioPathFromName, getAudioFromPath, getCurrentAudioLength } from '../../../../../tasks/playerTasks/PlayerLogic';
import FetchAudio from '../../../../../tasks/editorTasks/FetchAudio';

// "LayoutMenuModalUpload.jsx" component is accessed by the editor. It handles the upload of data with validated and unvalidated files, arrangement of categorys, 
// plays audio if the user wants to check his audio files, shows graphics if the user wants to check the graphics, sorts the files, shows used files, can change names of files,
// shows length of audio files and handles the deletion of files.
// Is a child of "LayoutEditorButtons" component
const LayoutMenuModalUpload = ({ isModalUploadOpen, setModalsState, audiobookTitle, nodes, setNodes, setFileChange }) => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [projectFiles, setProjectFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [sortBy, setSortBy] = useState('byName');
    const [audioUrls, setAudioUrls] = useState([]);
    const [showAudio, setShowAudio] = useState(false);
    const [graphicUrls, setGraphicUrls] = useState([]);
    const [showGraphic, setShowGraphic] = useState(false);
    const [audioPaths, setAudioPaths] = useState([])
    const [audioLengths, setAudioLengths] = useState({})
    const [category, setCategory] = useState('universal');
    const [localFileRejections, setLocalFileRejections] = useState([]);
    const [editedName, setEditedName] = useState('');
    const [oldEditedName, setOldEditedName] = useState('');
    const [editMode, setEditMode] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const audioUsage = useAudioUsage(audioPaths);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedAudio = await FetchAudio(audiobookTitle);
            setAudioPaths(fetchedAudio);
        };

        fetchData();
    }, [audiobookTitle, nodes]);

    useEffect(() => {
        setProjectFiles(files => sortFiles(files, sortBy, audioLengths, audioUsage));
    }, [sortBy]);

    const fetchAudioLengths = async () => {
        const lengths = {};
        for (const file of projectFiles) {
            if (file.name.endsWith('.mp3') || file.name.endsWith('.aac') || file.name.endsWith('.wav') || file.name.endsWith('.ogg') || file.name.endsWith('.m4a')) {
                try {
                    const audioPath = await getAudioPathFromName(file.name, audiobookTitle);
                    if (audioPath) {
                        const audioBlob = await getAudioFromPath(audioPath);
                        const duration = await getCurrentAudioLength(audioBlob);
                        if (duration !== null) {
                            lengths[file.name] = formatTime(Math.floor(duration));
                        } else {
                            console.error('Failed to get audio length for file:', file.name);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching audio length:', error);
                }
            }
        }
        setAudioLengths(lengths);
    };

    useEffect(() => {
        fetchAudioLengths();
    }, [projectFiles]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

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
            'audio/wav': ['.wav'],
        },
        maxFiles: 30,
        onDropAccepted: async (acceptedFiles) => {
            const checkFiles = async () => {
                for (const file of acceptedFiles) {
                    if (file.type.startsWith('audio/') && (await checkAudioChannels(file))) {
                        setLocalFileRejections(prevRejections => [...prevRejections, { file, errors: [{ code: 'stereo', message: 'Bitte laden Sie nur Mono-Audio-Dateien hoch.' }] }]);
                        setUploadSuccess(false);
                        return;
                    }
                }
            };

            const checkAudioChannels = async (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const context = new AudioContext();
                        const audioData = event.target.result;
                        context.decodeAudioData(audioData, (buffer) => {
                            if (buffer.numberOfChannels > 1) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }, () => reject());
                    };
                    reader.readAsArrayBuffer(file);
                });
            };

            checkFiles();
        },
        onDropRejected: () => setUploadSuccess(false),
    });

    const handleButtonClick = () => {
        const existingFileNames = projectFiles.map(file => file.name);
        const duplicateFiles = acceptedFiles.filter(file => existingFileNames.includes(file.name));

        const uniqueFiles = acceptedFiles.filter(file => !existingFileNames.includes(file.name));
        handleUpload(uniqueFiles, audiobookTitle, category, setUploadSuccess);

        const rejectedFiles = duplicateFiles.map(file => ({
            file,
            errors: [{ code: 'duplicate', message: `The file "${file.name}" already exists in the project.` }]
        }));
        setLocalFileRejections(rejectedFiles);

        setFileChange(true);
    }

    const handleFileClick = async (file) => {
        if (selectedFiles.includes(file)) {
            setSelectedFiles(selectedFiles.filter(f => f !== file));
        } else {
            setSelectedFiles([...selectedFiles, file]);
        }
    }

    const handleDeleteSelectedFiles = () => {
        const linkedFiles = selectedFiles.filter(file => audioUsage[file.name]);
        if (linkedFiles.length > 0) {
            setShowDeleteModal(true);
        } else {
            deleteFiles(selectedFiles);
        }
    }

    const deleteFiles = (filesToDelete) => {
        filesToDelete.forEach(file => {
            handleFileDelete(file.name, audiobookTitle, setProjectFiles);
        });
        setSelectedFiles([]);
        setAudioUrls([]);
        setShowAudio(false);
        setShowGraphic(false);
        setShowDeleteModal(false);

        deleteFileFromNodes(filesToDelete, nodes);
        setNodes([...nodes]);
        setFileChange(true);
    };

    const deleteFileFromNodes = (filesToDelete, nodes) => {
        const fileNamesToDelete = filesToDelete.map(file => file.name);

        nodes.forEach(node => {
            Object.keys(node.data).forEach(key => {
                if (typeof node.data[key] === 'string' && fileNamesToDelete.includes(node.data[key])) {
                    node.data[key] = '';
                }
            });
        });
    };


    const handlePlayClick = () => {
        if (showAudio) {
            setShowAudio(false);
        } else {
            const audioFiles = selectedFiles.filter(file => {
                if (typeof file === 'string') {
                    return file.name.endsWith('.mp3') || file.name.endsWith('.aac') || file.name.endsWith('.wav') || file.name.endsWith('.ogg') || file.name.endsWith('.m4a');
                } else if (typeof file === 'object' && file.name) {
                    return file.name.endsWith('.mp3') || file.name.endsWith('.aac') || file.name.endsWith('.wav') || file.name.endsWith('.ogg') || file.name.endsWith('.m4a');
                }
                return false;
            });
            if (audioFiles.length === 1) {
                setShowAudio(true);
                setShowGraphic(false);
                fetchAudioUrl(audioFiles[0].name, audiobookTitle, (audioUrl) => setAudioUrls([audioUrl]));
            } else if (audioFiles.length === 0) {
                alert('Please select an audio file to play.');
            } else {
                alert('Please select only one audio file to play.');
            }
        }
    }

    const handleShowGraphic = () => {
        if (showGraphic) {
            setShowGraphic(false);
        } else {
            const graphicFiles = selectedFiles.filter(file => file.name.endsWith('.png') || file.name.endsWith('.PNG') || file.name.endsWith('.jpg') || file.name.endsWith('.JPG') || file.name.endsWith('.jpeg') || file.name.endsWith('.jpeg'));
            if (graphicFiles.length === 1) {
                setShowGraphic(true);
                setShowAudio(false);
                fetchGraphicUrl(graphicFiles[0].name, audiobookTitle, (graphicUrl) => setGraphicUrls([graphicUrl]));
            } else if (graphicFiles.length === 0) {
                alert('Please select a graphic file to display.');
            } else {
                alert('Please select only one graphic file to display.');
            }
        }

    }

    const handleCategoryChange = (file, selectedCategory) => {
        const updatedProjectFiles = projectFiles.map(item => {
            if (item.name === file.name) {
                return { ...item, category: selectedCategory };
            }
            return item;
        });
        changeCategory(file.name, selectedCategory, audiobookTitle);
        setProjectFiles(updatedProjectFiles);
    };

    const handleEditClick = (file) => {
        setEditMode(prevState => ({ ...prevState, [file.name]: !prevState[file.name] }));
        setEditedName(file.name);
        setOldEditedName(file.name);
    }

    const handleNameChange = (e, file) => {
        setEditedName(e.target.value);
    }

    const handleNameConfirmation = async (file) => {
        if (editedName !== '') {
            if (!file.name.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)) {
                const newNodes = nodes.map(node => {
                    const updatedData = { ...node.data };

                    for (const key in updatedData) {
                        if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
                            if ((key.includes('Audio') || key.includes('audio')) && updatedData[key] === oldEditedName) {
                                updatedData[key] = editedName;
                            }
                        }
                    }

                    return updatedData !== node.data ? { ...node, data: updatedData } : node;
                });

                setNodes(newNodes);
            } else {
                const response = await handleChangeNameInDetails(audiobookTitle, oldEditedName, editedName);
                if (response) {
                    console.log('Name of the graphic was successfully changed in Details', response.data)
                }
            }
            const response = await handleChangeName(audiobookTitle, oldEditedName, editedName);
            if (response) {
                console.log('Name was successfully changed in the database', response.data);

                const updatedProjectFiles = projectFiles.map(f => {
                    if (f.name === oldEditedName) {
                        return { ...f, name: editedName };
                    }
                    return f;
                });
                setProjectFiles(updatedProjectFiles);
            } else {
                console.error('Error while changing Name on the Server.');
            }
            setEditMode(prevState => ({ ...prevState, [file.name]: false }));
        }
    }

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

    }, [audiobookTitle, uploadSuccess, category, acceptedFiles]);

    useEffect(() => {
        if (uploadSuccess) {
            setTimeout(() => {
                setUploadSuccess(false);
                setSelectedFiles([]);
                setLocalFileRejections([]);
            }, 5000);
        }
    }, [uploadSuccess]);

    useEffect(() => {
        setProjectFiles(files => sortFiles(files));
    }, [sortBy]);

    return (
        <>
            <Modal isOpen={isModalUploadOpen} size='5xl' onClose={() => setModalsState(prevState => ({ ...prevState, isUploadModalOpen: false }))}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Media Manager</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='layout-menu-modal-upload-wrapper'>
                            <div className='layout-menu-modal-upload-left'>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <div className='layout-menu-modal-upload-dropzone'>
                                        <p>Drag some files here, or click to select files.</p>
                                        <DownloadIcon style={{ fontSize: 64, color: 'white', marginLeft: '10px' }} />
                                    </div>
                                </div>
                                {uploadSuccess ? (
                                    <p style={{ color: 'black', fontWeight: 'bold', marginTop: '20px' }}>Your files have been successfully uploaded to the server!</p>
                                ) :
                                    <aside>
                                        <p style={{ color: 'black', fontSize: '18px', marginTop: '10px', textDecoration: 'underline' }}>Files</p>
                                        <ul>
                                            {acceptedFiles.map((file, index) => (
                                                <li key={index}>
                                                    <span style={{ color: 'black', marginRight: '10px' }}>{file.name}</span>
                                                    <span style={{ color: 'black' }}>{file.size} bytes</span>
                                                    {audioUsage[file.name] ? <span style={{ color: 'green', marginLeft: '10px' }}>✓</span> : null}
                                                </li>
                                            ))}
                                        </ul>
                                        {localFileRejections.length > 0 && <p style={{ color: 'black', fontSize: '18px', marginTop: '10px', textDecoration: 'underline' }}>Rejected files:</p>}
                                        <ul style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                                            {localFileRejections.map(({ file, errors }) => (
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
                                }
                                {acceptedFiles.length !== 0 && !uploadSuccess && localFileRejections.length <= 0 && (<Button colorScheme='highlightColor' style={{ marginTop: '10px' }} onClick={handleButtonClick}>Upload</Button>)}
                            </div>

                            <div className='layout-menu-modal-upload-right-wrapper'>
                                <div className='layout-menu-modal-upload-right'>
                                    <div className='layout-menu-modal-upload-right-buttons'>
                                        <div className='layout-menu-modal-upload-right-buttons-left'>
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
                                        <div className='layout-menu-modal-upload-right-buttons-right'>
                                            <Select size='sm' value={sortBy} onChange={(e) => setSortBy(e.target.value)} focusBorderColor='darkButtons'>
                                                <option value='byName'>Sort by name</option>
                                                <option value='byDataType'>Sort by data type</option>
                                                <option value='byCategory'>Sort by category</option>
                                                <option value='byLength'>Sort by length</option>
                                                <option value='byUsed'>Sort by used files</option>
                                                <option value='byDate'>Sort by uploaddate</option>
                                            </Select>
                                            <Select size='sm' value={category} onChange={(e) => setCategory(e.target.value)} focusBorderColor='darkButtons'>
                                                <option value='universal'>Universal</option>
                                                <option value='question'>Question Audio</option>
                                                <option value='story'>Story Audio</option>
                                                <option value='interaction'>Interaction Signal Audio</option>
                                                <option value='background'>Background Audio</option>
                                                <option value='answer'>Answer Audio</option>
                                            </Select>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='layout-menu-modal-upload-right-content'>
                                        {projectFiles
                                            .filter(file => category === 'universal' || file.category === category)
                                            .map((file, index) => (
                                                <div key={index} className='file-item' style={{ backgroundColor: selectedFiles.includes(file) ? '#bfbfbf' : (audioUsage[file.name] ? '#C6F6D5' : 'transparent'), display: 'flex', alignItems: 'center' }}>
                                                    <IconButton icon={<EditIcon />} onClick={() => handleEditClick(file)} colorScheme='highlightColor' size='xs' margin='5px' />
                                                    {!editMode[file.name] && (
                                                        <p onClick={() => handleFileClick(file)} style={{ marginRight: '10px', flex: '1' }}>
                                                            {file.name}
                                                            {audioUsage[file.name] ? <span style={{ color: 'green', marginLeft: '10px' }}>✓</span> : null}
                                                        </p>
                                                    )}
                                                    {editMode[file.name] && (
                                                        <input type='text' colorScheme='darkButtons' value={editedName} onChange={(e) => handleNameChange(e, file)} style={{ paddingLeft: '5px' }} />
                                                    )}
                                                    {audioLengths[file.name] && !editMode[file.name] && (
                                                        <span style={{ color: 'black', marginRight: '10px' }}>Length: {audioLengths[file.name]}</span>
                                                    )}
                                                    {!editMode[file.name] && (
                                                        <div style={{ width: '150px' }}>
                                                            <Select size='sm' value={file.category || 'universal'} onChange={(e) => handleCategoryChange(file, e.target.value)} focusBorderColor='darkButtons' style={{ justifyContent: 'flex-end', flex: '1', alignItems: 'center' }}>
                                                                <option value='question'>Question Audio</option>
                                                                <option value='story'>Story Audio</option>
                                                                <option value='interaction'>Interaction Signal Audio</option>
                                                                <option value='background'>Background Audio</option>
                                                                <option value='answer'>Answer Audio</option>
                                                                <option value='universal'>Universal</option>
                                                                <option value='answerProcessAudio'>Answer Process Audio</option>
                                                            </Select>
                                                        </div>
                                                    )}
                                                    {editMode[file.name] && (
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
                                                            <Button size='sm' colorScheme='highlightColor' style={{ marginRight: '8px' }} onClick={() => handleNameConfirmation(file)}>Confirm</Button>
                                                            <Button size='sm' colorScheme='darkButtons' onClick={() => setEditMode(prevState => ({ ...prevState, [file.name]: false }))}>Cancel</Button>
                                                        </div>
                                                    )}
                                                </div>

                                            ))}
                                    </div>
                                </div>
                                <div className='layout-menu-modal-upload-right-player'>
                                    {showAudio && audioUrls.map((audioUrl, index) => (
                                        audioUrl && (
                                            <audio key={index} controls>
                                                <source src={audioUrl} type='audio/mpeg' />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )
                                    ))}

                                    {showGraphic && graphicUrls.map((graphicUrl, index) => (
                                        graphicUrl && (
                                            <img key={index} src={graphicUrl} alt='Graphic' />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>One or more selected files are used in your project. Are you sure you want to delete them? </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='highlightColor' style={{ marginRight: '10px' }} onClick={() => deleteFiles(selectedFiles)}>Yes, Delete</Button>
                        <Button colorScheme='darkButtons' md='5px' onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default LayoutMenuModalUpload;