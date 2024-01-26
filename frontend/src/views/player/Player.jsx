import React, { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

import './player.css';
import FetchFlow from '../../components/tasks/FetchFlow';
import { getAudioPathFromName, getAudioFromPath } from '../../components/tasks/PlayerLogic';

const Player = () => {
  const [flow, setFlow] = useState(null);
  const [audioPath, setAudioPath] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentNode, setCurrentNode] = useState(1);
  const [currentNodeProps, setCurrentNodeProps] = useState(null);

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
        setAudioPath(path);
        const audioBlobResponse = await getAudioFromPath(path);
        setAudioBlob(audioBlobResponse);
        setCurrentNodeProps(flow.nodes[currentNode].data);
      }
    };

    fetchData();
  }, [currentNode, flow]);

  console.log('Flow in Player: ', flow);
  console.log('AudioPfad in Player: ', audioPath);
  console.log('CurrentNodeProps', currentNodeProps);

  return (
    <div className="player-wrapper">
      <div>Other Content</div>
      <div className="player">
        {audioBlob && (
          <ReactAudioPlayer autoPlay controls src={audioBlob} />
        )}
      </div>
      {currentNodeProps && currentNodeProps.answers && currentNodeProps.answers.length > 0 && (
        <div>
          <p>Frage: {currentNodeProps.question}</p>
          <p>Antworten:</p>
          <ul>
            {currentNodeProps.answers.map((answer, index) => (
              <li key={index}>
                <button>{answer}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Player;
