import React, { useState, useRef } from 'react'
import { Input, Button, Stack, Checkbox } from '@chakra-ui/react';
import { v4 as uuid4 } from 'uuid';

import '../audioBookSetup/audiobook-setup.css';

import LayoutEditorLinks from '../../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorLinks';
import { handleTitleChange, handleCheckBoxChange } from '../../components/layoutComponents/layoutAudiobookSetup/layoutSetupFunctions';

const AudioBookSetup = () => {
    const [newAudioBook, setNewAudioBook] = useState({});

    const handleCreateAudioBook = () => {
        const audiobookFormat = {
            title: '',
            description: '',
            id: uuid4(),
        }

        setNewAudioBook(audiobookFormat);
    }

    const inputSelections = useRef({
        mouse: false, touch: false, speak: false, keyboard: false, touchKeyboard: false, shake: false
    })

    return (
        <>
            <LayoutEditorLinks />

            <div className="audiobook-setup">
                {!newAudioBook && (
                    <Button colorScheme='blue' onClick={(e) => handleCreateAudioBook()}>Create New Audiobook</Button>
                )}

                {newAudioBook && (
                    <div className='audiobook-setup-contents'>
                        <div className='audiobook-setup-contents-inputs'>
                            <p>Audiobook Title</p>
                            <Input
                                placeholder='Audiobook Title ..'
                                size='md'
                                width='300px'
                                onChange={(e) => handleTitleChange(e)}
                            />

                            <p>Audiobook Description</p>
                            <Input
                                placeholder='Audiobook Description ..'
                                size='md'
                                width='300px'
                            />
                            <p>Choose Input Selection</p>
                            <Stack direction="row" flexWrap="wrap">
                                {Object.keys(inputSelections.current).map((key, index) => (
                                    <Checkbox
                                        key={index}
                                        isChecked={inputSelections.current[key]}
                                        onChange={() => handleCheckBoxChange(key)}
                                    >
                                        {key}
                                    </Checkbox>
                                ))}

                            </Stack>
                        </div>
                        <div className='audiobook-setup-contents-buttons'>
                            <Button colorScheme='blue'>Start Editing</Button>
                            <Button colorScheme='red'>Cancel</Button>
                        </div>
                    </div>

                )}


            </div>
        </>
    )
}

export default AudioBookSetup