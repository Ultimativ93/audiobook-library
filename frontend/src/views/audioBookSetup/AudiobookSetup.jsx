import React, { useState, useEffect } from 'react';
import { v4 as uuid4 } from 'uuid';
import { useParams } from 'react-router-dom';

import '../audioBookSetup/audiobook-setup.css';

import NewAudiobookSetup from './NewAudiobookSetup';
import ExistingAudiobookSetup from './ExistingAudiobookSetup';
import { handleGetDetails } from '../../components/tasks/setupTasks/FetchDetails';

const AudioBookSetup = ({ setModalsState }) => {
    const [newAudiobook, setNewAudiobook] = useState();
    const [existingAudiobookDetails, setExistingAudiobookDetails] = useState();

    const { audiobookTitle } = useParams();

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

    useEffect(() => {
        const fetchData = async () => {
            if (audiobookTitle !== 'null' && audiobookTitle !== undefined) {
                try {
                    const details = await handleGetDetails(audiobookTitle);
                    setExistingAudiobookDetails(details);
                } catch (error) {
                    console.error('Error fetching audiobook details:', error);
                }
            } else {
                handleCreateAudioBook();
            }
        };

        fetchData();
    }, [audiobookTitle]);



    return (
        <>  
            <div className="audiobook-setup">
                {newAudiobook && (
                    <NewAudiobookSetup newAudiobook={newAudiobook} setNewAudiobook={setNewAudiobook} setModalsState={setModalsState} />
                )}

                {existingAudiobookDetails && (
                    <ExistingAudiobookSetup existingAudiobookDetails={existingAudiobookDetails} setExistingAudiobookDetails={setExistingAudiobookDetails} setModalsState={setModalsState} />
                )}
            </div>
        </>
    );
}

export default AudioBookSetup;
