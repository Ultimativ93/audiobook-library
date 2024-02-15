import axios from 'axios';

const handleUpload = async (selectedFiles, audiobookTitle, setUploadSuccess) => {
    try {
        const existingFiles = await checkExistingFiles(selectedFiles, audiobookTitle);

        const newFiles = selectedFiles.filter(file => !existingFiles.includes(file.name));

        if (newFiles.length === 0) {
            console.log('All files already exist, skipping upload.');
            setUploadSuccess(true);
            return;
        }

        const formData = new FormData();
        newFiles.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('audiobookTitle', audiobookTitle);

        const response = await fetch('http://localhost:3005/upload', {
            method: 'POST',
            body: formData,
        });

        console.log('Response:', response);

        const responseData = await response.json();
        console.log('Response Data:', responseData);
        console.log('Response.ok: ', response.ok);

        if (response.ok) {
            console.log('Nice! Files uploaded successfully:', responseData.message);
            setUploadSuccess(true);
        } else {
            console.error('Error uploading files');
            setUploadSuccess(false);
        }
    } catch (error) {
        console.error('Error in catch:', error);
        setUploadSuccess(false);
    }
};

const checkExistingFiles = async (files, audiobookTitle) => {
    const existingFiles = [];

    try {
        const response = await axios.get(`http://localhost:3005/getDataFromFlow?flowKey=${audiobookTitle}`);
        const fileNames = response.data;

        files.forEach(file => {
            if (fileNames.includes(file.name)) {
                existingFiles.push(file.name);
            }
        });
    } catch (error) {
        console.error('Error checking existing files:', error);
    }

    return existingFiles;
};

const handleFileDelete = async (file, audiobookTitle, setProjectFiles) => {
    try {
        const response = await axios.post('http://localhost:3005/deleteFile', { file, audiobookTitle });
        console.log('File deleted successfully:', response.data);
        const updatedProjectFiles = await fetchDataFromServer(audiobookTitle);
        setProjectFiles(updatedProjectFiles);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

const fetchDataFromServer = async (audiobookTitle) => {
    try {
        const response = await axios.get(`http://localhost:3005/getDataFromFlow?flowKey=${audiobookTitle}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data with flowkey:', error);
        return [];
    }
};

const fetchAudioUrl = async (fileName, setAudioUrl) => {
    console.log("FileName in fetchAudioUrl: ", fileName);

    try {
        const response = await axios.get(`http://localhost:3005/getAudioName?audioName=${fileName}`);
        const audioPath = response.data;
        console.log("AudioPath in fetchAudioUrl: ", audioPath);

        const audioBlobResponse = await axios.get(`http://localhost:3005/getAudio?audioPath=${encodeURIComponent(audioPath)}`, {
            responseType: 'blob'
        });

        const audioBlob = new Blob([audioBlobResponse.data], { type: 'audio/ogg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        console.log("AudioBlob: ", audioBlob);
        console.log("AudioUrl: ", audioUrl);

        setAudioUrl(audioUrl);
    } catch (error) {
        console.error('Error fetching audio URL:', error);
    }
}

const fetchGraphicUrl = async (fileName, setGraphicUrl) => {
    try {
        const response = await axios.get(`http://localhost:3005/getGraphicName?graphicName=${fileName}`);
        const graphicPath = response.data;
        const graphicBlobResponse = await axios.get(`http://localhost:3005/getGraphic?graphicPath=${encodeURIComponent(graphicPath)}`, {
            responseType: 'blob'
        });
        const graphicBlob = new Blob([graphicBlobResponse.data], { type: 'image/jpeg' });
        const graphicUrl = URL.createObjectURL(graphicBlob);
        setGraphicUrl(graphicUrl);
    } catch (error) {
        console.error('Error fetching graphic URL:', error);
    }
}

export {
    handleUpload,
    checkExistingFiles,
    handleFileDelete,
    fetchAudioUrl,
    fetchGraphicUrl,
};