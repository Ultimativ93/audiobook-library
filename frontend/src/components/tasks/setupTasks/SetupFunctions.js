const handleInputChange = (event, field ,newAudiobook, setNewAudiobook) => {
    console.log("Event, newAudiobook", event, newAudiobook);
    setNewAudiobook(prevAudiobook => ({
        ...prevAudiobook,
        [field]: event
    }));
}

const handleInputChangeSecondLevel = (event, field, setNewAudiobook) => {
    const [firstLevel, secondLevel, index] = field.split('.');
    const contributorIndex = parseInt(index);

    setNewAudiobook((prevAudiobook) => {
        const updatedContributors = [...prevAudiobook[firstLevel]];
        updatedContributors[contributorIndex] = {
            ...updatedContributors[contributorIndex],
            [secondLevel]: event,
        };

        return {
            ...prevAudiobook,
            [firstLevel]: updatedContributors,
        };
    });
};


const handleCheckBoxChange = (key, newAudiobook, setNewAudiobook) => {
    console.log("inputSelections:", newAudiobook.inputSelections);
    setNewAudiobook(prevAudiobook => ({
        ...prevAudiobook,
        inputSelections: {
            ...prevAudiobook.inputSelections,
            [key]: !prevAudiobook.inputSelections[key]
        }
    }));
}

const handleAddContributor = (setNewAudiobook) => {
    const newContributor = {
        role: '',
        name: '',
    }

    setNewAudiobook(prevAudiobook => ({
        ...prevAudiobook,
        contributors: [
            ...prevAudiobook.contributors,
            newContributor,
        ]
        
    }))
}

const handleRemoveContributor = (index, setNewAudiobook) => {
        setNewAudiobook(prevAudiobook => {
            const updatedContributors = [...prevAudiobook.contributors];
            updatedContributors.splice(index, 1);

            return {
                ...prevAudiobook,
                contributors: updatedContributors,
            };
        });
}

const handleCheckSetup = (newAudiobook) => {
    const missingFields = [];

    if (!newAudiobook) {
        console.error('newAudiobook ist nicht definiert');
        return false;
    }

    if (!newAudiobook.title || newAudiobook.title.trim() === '') {
        missingFields.push('Audiobook Title');
    }

    if (!newAudiobook.description || newAudiobook.description.trim() === '') {
        missingFields.push('Audiobook Description');
    }

    if (!newAudiobook.author || newAudiobook.author.trim() === '') {
        missingFields.push('Author');
    }

    if (!newAudiobook.inputSelections || Object.keys(newAudiobook.inputSelections).length === 0) {
        missingFields.push('Select at least one input option');
    }

    if (!newAudiobook.contributors || newAudiobook.contributors.length === 0) {
        missingFields.push('At least one contributor is required');
    } else {
        newAudiobook.contributors.forEach((contributor, index) => {
            if (!contributor.role || contributor.role.trim() === '') {
                missingFields.push(`Contributor ${index + 1} role`);
            }
            if (!contributor.name || contributor.name.trim() === '') {
                missingFields.push(`Contributor ${index + 1} name`);
            }
        });
    }

    if (!newAudiobook.category || newAudiobook.category.trim() === '') {
        missingFields.push('Category');
    }

    if (missingFields.length === 0) {
        return newAudiobook;
    } else {
        console.log('Missing fields:', missingFields);
        alert(`Missing fields: ${missingFields.join(', ')}`);
        return false;
    }
};

export {
    handleInputChange,
    handleCheckBoxChange,
    handleInputChangeSecondLevel,
    handleAddContributor,
    handleRemoveContributor,
    handleCheckSetup,
}