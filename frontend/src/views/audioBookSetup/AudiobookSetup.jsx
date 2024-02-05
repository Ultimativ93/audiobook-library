import React, { useState } from 'react';
import { Input, Button, Stack, Checkbox, Textarea, Select, Flex } from '@chakra-ui/react';
import { v4 as uuid4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import '../audioBookSetup/audiobook-setup.css';

import LayoutLinks from '../../components/layoutComponents/layoutCommon/layoutLinks/LayoutLinks';
import { handleInputChange, handleCheckBoxChange, handleInputChangeSecondLevel, handleAddContributor, handleRemoveContributor, handleCheckSetup } from '../../components/layoutComponents/layoutAudiobookSetup/LayoutSetupFunctions';
import { handleUploadDetails } from '../../components/tasks/setupTasks/UploadDetails';

const AudioBookSetup = () => {
    const [newAudiobook, setNewAudiobook] = useState();
    const navigate = useNavigate();

    const isFieldEmpty = (field) => {
        return field === 'string' && field.trim() === '';
    };

    const handleCreateAudioBook = () => {
        const audiobookFormat = {
            title: '',
            description: '',
            author: '',
            contributors: [],
            category: '',
            inputSelections: {
                mouse: false,
                touch: false,
                speak: false,
                keyboard: false,
                touchKeyboard: false,
                shake: false
            },
            id: uuid4(),
        }
        setNewAudiobook(audiobookFormat);
    }

    return (
        <>
            <LayoutLinks />

            <div className="audiobook-setup">
                {!newAudiobook && (
                    <Button colorScheme='blue' onClick={() => handleCreateAudioBook()}>Create New Audiobook</Button>
                )}

                {newAudiobook && (
                    <div className='audiobook-setup-contents'>
                        <div className='audiobook-setup-contents-inputs'>
                            <p>Audiobook Title</p>
                            <Input
                                placeholder='Audiobook Title ..'
                                size='md'
                                width='300px'
                                value={newAudiobook.title}
                                onChange={(e) => handleInputChange(e.target.value, 'title', newAudiobook, setNewAudiobook)}
                                borderColor={isFieldEmpty(newAudiobook.title) ? 'red' : 'default'}
                            />

                            <p>Audiobook Description</p>
                            <Textarea
                                placeholder='Audiobook Description ..'
                                size='md'
                                width='300px'
                                height='200px'
                                value={newAudiobook.description}
                                onChange={(e) => handleInputChange(e.target.value, 'description', newAudiobook, setNewAudiobook)}
                                resize='vertical'
                                borderColor={isFieldEmpty(newAudiobook.description) ? 'red' : 'default'}
                            />

                            <p>Author</p>
                            <Input
                                placeholder='Author ..'
                                size='md'
                                width='300px'
                                value={newAudiobook.author}
                                onChange={(e) => handleInputChange(e.target.value, 'author', newAudiobook, setNewAudiobook)}
                                borderColor={isFieldEmpty(newAudiobook.author) ? 'red' : 'default'}
                            />

                            <p>Choose Input Selection</p>
                            <Stack direction="row" flexWrap="wrap">
                                {Object.keys(newAudiobook.inputSelections).map((key, index) => (
                                    <Checkbox
                                        key={index}
                                        isChecked={newAudiobook.inputSelections[key]}
                                        onChange={() => handleCheckBoxChange(key, newAudiobook, setNewAudiobook)}
                                    >
                                        {key}
                                    </Checkbox>
                                ))}
                            </Stack>

                            <div className="audiobook-setup-contents-contributors">
                                <p>Contributors</p>
                                {newAudiobook.contributors && newAudiobook.contributors.map((contributor, index) => (
                                    <div key={index}>
                                        <Flex key={index} alignItems="center">
                                            <Select
                                                placeholder='Select Role ..'
                                                value={contributor.role}
                                                width='200px'
                                                onChange={(e) => handleInputChangeSecondLevel(e.target.value, `contributors.role.${index}`, setNewAudiobook)}
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
                                                value={contributor.name}
                                                onChange={(e) => handleInputChangeSecondLevel(e.target.value, `contributors.name.${index}`, setNewAudiobook)}
                                                borderColor={isFieldEmpty(contributor.name) ? 'red' : 'default'}
                                            />
                                            <Button
                                                colorScheme='red'
                                                onClick={() => handleRemoveContributor(index, setNewAudiobook)}
                                            >X</Button>
                                        </Flex>
                                    </div>
                                ))}
                                <Button
                                    colorScheme='blue'
                                    onClick={() => handleAddContributor(setNewAudiobook)}
                                >
                                    Add Contributor
                                </Button>
                            </div>

                            <Select
                                placeholder='Select Category .. '
                                value={newAudiobook.category}
                                width='200px'
                                onChange={(e) => handleInputChange(e.target.value, 'category', newAudiobook, setNewAudiobook)}
                                borderColor={isFieldEmpty(newAudiobook.category) ? 'red' : 'default'}
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
                            <Button colorScheme='blue' onClick={() => {
                                const isAudiobook = handleCheckSetup(newAudiobook)
                                if (isAudiobook) {
                                    console.log("Alles richtig")
                                    const detailsSaved = handleUploadDetails(isAudiobook);
                                    if (detailsSaved) {
                                        navigate('/', { state: { audiobookTitle: isAudiobook.title } });
                                    } else {
                                        alert("Something went wrong. Try again please or contact support!")
                                    }
                                }
                            }}>
                                Start Editing
                            </Button>
                            <Button colorScheme='red'>Cancel</Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AudioBookSetup;
