import axios from 'axios';

const handleUpload = async (selectedFiles, audiobookTitle, category, setUploadSuccess) => {
    try {
        const existingFiles = await checkExistingFiles(selectedFiles, audiobookTitle);

        const newFiles = selectedFiles.filter(file => !existingFiles.includes(file.name));
        const uploadDate = new Date();

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
        formData.append('category', category);
        formData.append('uploadDate', uploadDate)

        const response = await fetch('http://localhost:3005/upload', {
            method: 'POST',
            body: formData,
        });

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
        console.log("Response DATA in fetchDataFromServer: ", response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching data with flowkey:', error);
        return [];
    }
};

const fetchAudioUrl = async (fileName, audiobookTitle, setAudioUrl) => {
    try {
        const response = await axios.get(`http://localhost:3005/getAudioName?audioName=${fileName}&audiobookTitle=${audiobookTitle}`);
        const audioPath = response.data;

        const audioBlobResponse = await axios.get(`http://localhost:3005/getAudio?audioPath=${encodeURIComponent(audioPath)}`, {
            responseType: 'blob'
        });

        const audioBlob = new Blob([audioBlobResponse.data], { type: 'audio/ogg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioUrl(audioUrl);
    } catch (error) {
        console.error('Error fetching audio URL:', error);
    }
}

const fetchGraphicUrl = async (fileName, audiobookTitle, setGraphicUrl) => {
    try {
        const response = await axios.get(`http://localhost:3005/getGraphicName?graphicName=${fileName}&audiobookTitle=${audiobookTitle}`);
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

const changeCategory = async (file, selectedCategory, audiobookTitle) => {
    try {
        await axios.post('http://localhost:3005/updateCategory', { fileName: file, category: selectedCategory, audiobookTitle: audiobookTitle });
    } catch (error) {
        console.error('Error updating category:', error);
    }
};

const sortFiles = (files, sortBy, audioLengths, audioUsage) => {
    const sortedFiles = [...files];
    if (sortBy === 'byName') {
        sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'byDataType') {
        sortedFiles.sort((a, b) => {
            const extA = a.name.split('.').pop();
            const extB = b.name.split('.').pop();
            return extA.localeCompare(extB);
        });
    } else if (sortBy === 'byCategory') {
        sortedFiles.sort((a, b) => {
            if (a.category === b.category) {
                return a.name.localeCompare(b.name);
            } else {
                return a.category.localeCompare(b.category);
            }
        });
    } else if (sortBy === 'byLength') {
        sortedFiles.sort((a, b) => {
            const isAudioFileA = a.name.endsWith('.mp3') || a.name.endsWith('.aac') || a.name.endsWith('.wav') || a.name.endsWith('.ogg') || a.name.endsWith('.m4a');
            const isAudioFileB = b.name.endsWith('.mp3') || b.name.endsWith('.aac') || b.name.endsWith('.wav') || b.name.endsWith('.ogg') || b.name.endsWith('.m4a');

            if (isAudioFileA && isAudioFileB) {
                const lengthA = formatTimeInSeconds(audioLengths[a.name]);
                const lengthB = formatTimeInSeconds(audioLengths[b.name]);
                return lengthA - lengthB;
            } else if (isAudioFileA) {
                return -1;
            } else if (isAudioFileB) {
                return 1;
            } else {
                return 0;
            }
        });
    } else if (sortBy === 'byUsed') {
        sortedFiles.sort((a, b) => {
            const isAudioFileA = a.name.endsWith('.mp3') || a.name.endsWith('.aac') || a.name.endsWith('.wav') || a.name.endsWith('.ogg') || a.name.endsWith('.m4a');
            const isAudioFileB = b.name.endsWith('.mp3') || b.name.endsWith('.aac') || b.name.endsWith('.wav') || b.name.endsWith('.ogg') || b.name.endsWith('.m4a');
    
            if (isAudioFileA && isAudioFileB) {
                const isUsedA = audioUsage[a.name] || false;
                const isUsedB = audioUsage[b.name] || false;
    
                if (isUsedA && isUsedB) {
                    return 0;
                } else if (isUsedA) {
                    return -1;
                } else if (isUsedB) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (isAudioFileA) {
                return -1;
            } else if (isAudioFileB) {
                return 1;
            } else {
                return 0;
            }
        });
    } else if (sortBy === 'byDate') {
        sortedFiles.sort((a, b) => {
            const dateA = new Date(a.uploadDate);
            const dateB = new Date(b.uploadDate);
            return dateA - dateB;
        });
    }
    return sortedFiles;
};

const formatTimeInSeconds = (time) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
};

const handleChangeName = async (audiobookTitle, audioName, newAudioName) => {
    console.log("audioName in handleChange and newAudioName", audioName, newAudioName)
    try {
        const response = await axios.post('http://localhost:3005/changeAudioName', { audiobookTitle, audioName, newAudioName })
        console.log("Response in handleChangeName", response.data);
        return response.data;
    } catch (error) {
        console.error('Error changing audioName', error);
    }
}

const handleChangeNameInDetails = async (audiobookTitle, audioName, newAudioName) => {
    console.log("audioName in handleChangeNameInDetails and newAudioName", audioName, newAudioName);
    try {
        const response = await axios.post('http://localhost:3005/changeDetailsGraphicName', { audiobookTitle, audioName, newAudioName })
        console.log("Response in handleChangeNameInDetails", response.data);
        return response.data;
    } catch (error) {
        console.error('Error changing graphic name', error);
    }
}

export {
    handleUpload,
    checkExistingFiles,
    handleFileDelete,
    fetchAudioUrl,
    fetchGraphicUrl,
    changeCategory,
    sortFiles,
    formatTimeInSeconds,
    handleChangeName,
    handleChangeNameInDetails,
};