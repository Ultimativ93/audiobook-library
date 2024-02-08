import React from 'react'
import { Input, Button, Stack, Checkbox, Textarea, Select, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { handleInputChange, handleCheckBoxChange, handleInputChangeSecondLevel, handleAddContributor, handleRemoveContributor, handleCheckSetup } from '../../components/layoutComponents/layoutAudiobookSetup/LayoutSetupFunctions';
import { handleChangeDetails } from '../../components/tasks/setupTasks/FetchDetails';

const ExistingAudiobookSetup = ({ existingAudiobookDetails, setExistingAudiobookDetails, setIsModalSetupOpen }) => {
    console.log("existingAudiobookDetails", existingAudiobookDetails);

    const navigate = useNavigate();

    const isFieldEmpty = (field) => {
        return field === 'string' && field.trim() === '';
    };

    return (<>
        {existingAudiobookDetails && (
            <div className='audiobook-setup-contents'>
                <div className='audiobook-setup-contents-inputs'>
                    <p>Audiobook Title</p>
                    <Input
                        placeholder='Audiobook Title ..'
                        size='md'
                        width='300px'
                        value={existingAudiobookDetails?.title}
                        readOnly={true}
                        borderColor={isFieldEmpty(existingAudiobookDetails.title) ? 'red' : 'default'}
                    />

                    <p>Audiobook Description</p>
                    <Textarea
                        placeholder='Audiobook Description ..'
                        size='md'
                        width='300px'
                        height='200px'
                        value={existingAudiobookDetails?.description}
                        onChange={(e) => handleInputChange(e.target.value, 'description', existingAudiobookDetails, setExistingAudiobookDetails)}
                        resize='vertical'
                        borderColor={isFieldEmpty(existingAudiobookDetails) ? 'red' : 'default'}
                    />

                    <p>Author</p>
                    <Input
                        placeholder='Author ..'
                        size='md'
                        width='300px'
                        value={existingAudiobookDetails?.author}
                        onChange={(e) => handleInputChange(e.target.value, 'author', existingAudiobookDetails, setExistingAudiobookDetails)}
                        borderColor={isFieldEmpty(existingAudiobookDetails.author) ? 'red' : 'default'}
                    />

                    <p>Choose Input Selection</p>
                    <Stack direction="row" flexWrap="wrap">
                        {existingAudiobookDetails.inputSelections && Object.keys(existingAudiobookDetails.inputSelections).map((key, index) => (
                            <Checkbox
                                key={index}
                                isChecked={existingAudiobookDetails?.inputSelections[key]}
                                onChange={() => handleCheckBoxChange(key, existingAudiobookDetails, setExistingAudiobookDetails)}
                            >
                                {key}
                            </Checkbox>
                        ))}
                    </Stack>

                    <div className="audiobook-setup-contents-contributors">
                        <p>Contributors</p>
                        {existingAudiobookDetails?.contributors && existingAudiobookDetails.contributors.map((contributor, index) => (
                            <div key={index}>
                                <Flex key={index} alignItems="center">
                                    <Select
                                        placeholder='Select Role ..'
                                        value={contributor?.role}
                                        width='200px'
                                        onChange={(e) => handleInputChangeSecondLevel(e.target.value, `contributors.role.${index}`, setExistingAudiobookDetails)}
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
                                    />
                                    <Button
                                        colorScheme='red'
                                        onClick={() => handleRemoveContributor(index, setExistingAudiobookDetails)}
                                    >X</Button>
                                </Flex>
                            </div>
                        ))}
                        <Button
                            colorScheme='blue'
                            onClick={() => handleAddContributor(setExistingAudiobookDetails)}
                        >
                            Add Contributor
                        </Button>
                    </div>

                    <Select
                        placeholder='Select Category .. '
                        value={existingAudiobookDetails?.category}
                        width='200px'
                        onChange={(e) => handleInputChange(e.target.value, 'category', existingAudiobookDetails, setExistingAudiobookDetails)}
                        borderColor={isFieldEmpty(existingAudiobookDetails.category) ? 'red' : 'default'}
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
                        console.log("Button clicked")
                        if (existingAudiobookDetails) {
                            console.log("Existing: ", existingAudiobookDetails);
                            const isAudiobook = handleCheckSetup(existingAudiobookDetails)
                            console.log("Hier drutner")
                            if (isAudiobook) {
                                console.log("Alles richtig")
                                const detailsSaved = handleChangeDetails(isAudiobook);
                                if (detailsSaved) {
                                    setIsModalSetupOpen(false);
                                } else {
                                    alert("Something went wrong. Try again please or contact support!")
                                }
                            }
                        }
                    }}>Continue Editing</Button>
                    <Button colorScheme='red' onClick={() => navigate('/editor', { state: { audiobookTitle: existingAudiobookDetails.title, new: false } })}>Cancel</Button>
                </div>
            </div>
        )}
    </>
    )

}

export default ExistingAudiobookSetup