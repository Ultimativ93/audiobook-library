import axios from 'axios';

const handleUploadDetails = async (audiobookDetails) => {
    try {
        console.log("in handleUploadDetails", audiobookDetails)
        const response = await axios.post('http://localhost:3005/saveAudiobookDetails', {
            audiobookDetails,
        });

        if (response.status === 200) {
            console.log('Audiobook details successfully saved on the server.');
            return true;
        } else {
            console.error('Error saving audiobook details on the server.');
            return false;
        }
    } catch (error) {
        console.error('Error in try handleUploadDetails:', error);
        return false;
    }
};

const handleGetDetails = async (audiobookTitle) => {
    console.log("AudiobookTitle in FetchDetails:", audiobookTitle);
    try {
        const response = await axios.get('http://localhost:3005/getAudiobookDetails', {
            params: {
                audiobookTitle: audiobookTitle
            }
        });
        if (response.status === 200) {
            console.log('Audiobook details successfully fetched from the server.');
            return response.data;
        } else {
            console.error('Error fetching audiobook details from the server.');
            return null;
        }
    } catch (error) {
        console.error('Error in try handleGetDetails', error);
        throw error;
    }
}


export {
    handleUploadDetails,
    handleGetDetails,
}