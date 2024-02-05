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

export {
    handleUploadDetails,
}