import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { handleGetAllTutorials, handleGetTutorialVideo, handleGetThumbnail } from '../../components/tasks/tutorialTasks/TutorialsFunctions';

import './tutorials.css';

const Tutorials = () => {
  const [tutorialNames, setTutorialNames] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [tutorialVideo, setTutorialVideo] = useState(null);
  const [suggestedTutorials, setSuggestedTutorials] = useState([]);
  const [videoKey, setVideoKey] = useState(0);
  const [selectedTutorialIndex, setSelectedTutorialIndex] = useState(0);
  const [selectedTutorial, setSelectedTutorial] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTutorials = await handleGetAllTutorials();
        if (fetchedTutorials) {
          setTutorials(fetchedTutorials);
          const names = fetchedTutorials.map(tutorial => tutorial.tutorialName);
          setTutorialNames(names);

          // Selecting three random tutorials for suggestions
          const randomIndexes = getRandomIndexes(fetchedTutorials.length, 3);
          const randomTutorials = randomIndexes.map(index => fetchedTutorials[index]);

          // Fetching thumbnails for suggested tutorials
          const suggestedTutorialsWithThumbnails = await Promise.all(
            randomTutorials.map(async (tutorial) => {
              const thumbnail = await handleGetThumbnail(tutorial.tutorialThumbnailPath);
              return { ...tutorial, thumbnail };
            })
          );

          setSuggestedTutorials(suggestedTutorialsWithThumbnails);
          loadTutorialVideo(fetchedTutorials[0]);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Tutorials:', error);
      }
    };

    fetchData();
  }, []);

  console.log("Tutorials", tutorials);

  // Function to get random indexes
  const getRandomIndexes = (max, count) => {
    const indexes = [];
    while (indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  };

  // Function to load and display tutorial video
  const loadTutorialVideo = useCallback(async (tutorial) => {
    try {
      const videoData = await handleGetTutorialVideo(tutorial.tutorialVideoPath);
      setTutorialVideo(videoData);
      setSelectedTutorial({
        name: tutorial.tutorialName,
        shortDescription: JSON.parse(tutorial.tutorialData).shortDescription,
        longDescription: JSON.parse(tutorial.tutorialData).longDescription
      });
      setSelectedTutorialIndex(tutorialNames.indexOf(tutorial.tutorialName));
      setVideoKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Fehler beim Laden des Tutorial-Videos:', error);
    }
  }, [tutorialNames]);

  return (
    <div className='tutorials-wrapper'>
      <div className='tutorials-container'>
        <div className='tutorial-navigation'>
          <h3>Tutorials:</h3>
          {tutorialNames.map((tutorialName, index) => (
            <div key={index} onClick={() => loadTutorialVideo(tutorials[index])}>
              <Link to={`/tutorials/${tutorialName}`} className={selectedTutorialIndex === index ? 'selected' : ''}>
                <p>{tutorialName}</p>
              </Link>
            </div>
          ))}
        </div>

        <div className='tutorial-content'>
          <h2>Tutorials</h2>
          {selectedTutorial && (
            <div className="tutorial-details">
              <h3>{selectedTutorial.name}</h3>
              <p>{selectedTutorial.shortDescription}</p>
              {tutorialVideo ? (
                <video key={videoKey} controls>
                  <source src={tutorialVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                </div>
              )}
              <p>{selectedTutorial.longDescription}</p>
            </div>
          )}
        </div>
      </div>

      <div className='suggested-tutorials'>
        <h3>Suggested Tutorials:</h3>
        <div className='tutorial-suggestions'>
          {suggestedTutorials.map((tutorial, index) => (
            <div key={index} onClick={() => loadTutorialVideo(tutorial)}>
              <h4>{tutorial.tutorialName}</h4>
              {tutorial.thumbnail && <img src={tutorial.thumbnail} alt={tutorial.tutorialName} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
