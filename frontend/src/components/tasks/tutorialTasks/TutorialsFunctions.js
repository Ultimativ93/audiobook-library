import axios from 'axios';

// "TutorialsFunctions.js" handles functions for the "Tutorials" view component. It handle getting all the tutorials, aswell as get the tutorial video and fetches the thumbnail,
// Its main use is for the "Tutorials" view component.

export const handleGetAllTutorials = async () => {
  try {
    const response = await axios.get('http://localhost:3005/getAllTutorials');
    if (response.status === 200) {
      const tutorials = response.data;
      const tutorialsWithThumbnails = await Promise.all(
        tutorials.map(async (tutorial) => {
          const thumbnail = await handleGetThumbnail(tutorial.tutorialThumbnailPath);
          return { ...tutorial, thumbnail };
        })
      );
      return tutorialsWithThumbnails;
    } else {
      console.error('Error fetching allTutorials from the server.');
    }
  } catch (error) {
    console.error('Error fetching in handleGetAllTutorials:', error);
    return [];
  }
}

export const handleGetTutorialVideo = async (videoPath) => {
  try {
    const response = await axios.get('http://localhost:3005/getVideo', {
      params: {
        videoPath: videoPath
      },
      responseType: 'blob'
    });
    if (response.status === 200) {
      const videoBlob = new Blob([response.data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      return videoUrl;
    } else {
      console.error('Fehler beim Abrufen des Tutorial-Videos vom Server.');
      return null;
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Videos vom Backend:', error);
    return null;
  }
};

export const handleGetThumbnail = async (thumbnailPath) => {
  try {
    const response = await axios.get(`http://localhost:3005/getGraphic?graphicPath=${thumbnailPath}`, {
      responseType: 'blob'
    });

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Thumbnails vom Backend:', error);
    return null;
  }
};

