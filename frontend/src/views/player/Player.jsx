import React, { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

import './player.css';
import FetchFlow from '../../components/tasks/FetchFlow';
import LayoutEditorLinks from '../../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorLinks';
import { getAudioPathFromName, getAudioFromPath, handleButtonClickLogic } from '../../components/tasks/PlayerLogic';

const Player = () => {
  const [flow, setFlow] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentNode, setCurrentNode] = useState(1);
  const [currentNodeProps, setCurrentNodeProps] = useState(null);
  const [isEnd, setIsEnd] = useState(null);

  // useEffect that runs when the component renders first to fetch the flow
  useEffect(() => {
    const flowKey = 'First-trys'; // Setting flowkey manually, but will change that later to flowKey id + user.id
    FetchFlow(flowKey).then((flowData) => {
      setFlow(flowData);
    });
  }, []);

  // useEffect to update the audio path, audio blob, and current node props based on the current node
  useEffect(() => {
    const fetchData = async () => {
      if (flow != null && flow.nodes != null && flow.nodes.length > 1 && currentNode != null) {
        const path = await getAudioPathFromName(flow.nodes[currentNode].data.audioStory);
        const audioBlobResponse = await getAudioFromPath(path);
        setAudioBlob(audioBlobResponse);
        setCurrentNodeProps(flow.nodes[currentNode].data);
        if (flow.nodes[currentNode].data.isEnd === 'true') {
          setIsEnd(true);
          console.log('Ist ein Ende')
        }
      }
    };

    fetchData();
  }, [currentNode, flow]);

  const handleButtonClick = (index) => {
    handleButtonClickLogic(index, flow, currentNodeProps, setCurrentNode);
  };
  
  return (
    <>
      <LayoutEditorLinks />
      <div className="player-wrapper">
        <div>Other Content</div>
        {currentNodeProps && currentNodeProps.answers && currentNodeProps.answers.length > 0 && (
          <div>
            <p>Frage: {currentNodeProps.question}</p>
            <p>Antworten:</p>
            <ul>
              {currentNodeProps.answers.map((answer, index) => (
                <button style={{ margin: 10, backgroundColor: 'lightgray', padding: 20, borderRadius: 5 }} key={index} onClick={() => handleButtonClick(index)}>{answer}</button>
              ))}
            </ul>
          </div>
        )}
        <div className="player">
          {audioBlob && (
            <ReactAudioPlayer autoPlay controls src={audioBlob} />
          )}
        </div>

      </div>
    </>
  );
};

export default Player;
