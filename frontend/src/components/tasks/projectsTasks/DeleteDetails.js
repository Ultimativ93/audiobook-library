const handleDeleteProject = (audiobookTitle) => {
    console.log("In Delete Details: ", audiobookTitle);
    handleDeleteFiles(audiobookTitle);
    handleDeletePaths(audiobookTitle);
    handleDeleteFlow(audiobookTitle);
    handleDeleteDetail(audiobookTitle);
    return true;
}

const handleDeletePaths = async (audiobookTitle) => {
    console.log("AudiobookTitle Frontend: ", audiobookTitle);
    try {
        const response = await fetch('http://localhost:3005/deletePaths', {
            method: 'POST',
            body: audiobookTitle,
        });

        console.log('Response', response);

        const responseData = await response.json();
        console.log('Response Data:', responseData);
        console.log('Response.ok', response.ok)

        if (response.ok) {
            console.log('Deleted Paths from Audiobook successfully: ', responseData.message);
        } else {
            console.error('Error deleting Paths !!');
        }
    } catch (error) {
        console.error('Error deleting Paths', error);
    }
}

const handleDeleteFiles = async (audiobookTitle) => {
    console.log("AudiobookTitle Frontend: ", audiobookTitle);
    try {
        const response = await fetch('http://localhost:3005/deleteFiles', {
            method: 'POST',
            body: audiobookTitle,
        });

        const responseData = await response.json();
        console.log('Response Data:', responseData);
        console.log('Response.ok', response.ok)

        if (response.ok) {
            console.log('Deleted Files from Upload directory successfully: ', responseData.message);
        } else {
            console.error('Error deleting audios from directory !!');
        }
    } catch (error) {
        console.error('Error deleting audio from directory', error);
    }
}

const handleDeleteFlow = async (audiobookTitle) => {
    console.log("AudiobookTitle Frontend: ", audiobookTitle);
    try {
        const response = await fetch('http://localhost:3005/deleteFlow', {
            method: 'POST',
            body: audiobookTitle,
        });

        const responseData = await response.json();
        console.log('Response Data:', responseData);
        console.log('Response.ok', response.ok)

        if (response.ok) {
            console.log('Deleted Flow successfully: ', responseData.message);
        } else {
            console.error('Error deleting flow !!');
        }
    } catch (error) {
        console.error('Error deleting flow:', error);
    }
}

const handleDeleteDetail = async (audiobookTitle) => {
    console.log("AudiobookTitle Frontend: ", audiobookTitle);
    try {
        const response = await fetch('http://localhost:3005/deleteDetail', {
            method: 'POST',
            body: audiobookTitle,
        });

        const responseData = await response.json();
        console.log('Response Data:', responseData);
        console.log('Response.ok', response.ok)

        if (response.ok) {
            console.log('Deleted details successfully: ', responseData.message);
        } else {
            console.error('Error deleting detail !!');
        }
    } catch (error) {
        console.error('Error deleting detal:', error);
    }
}


export {
    handleDeleteProject,
    handleDeletePaths,
    handleDeleteFiles,
    handleDeleteFlow,
    handleDeleteDetail,
}