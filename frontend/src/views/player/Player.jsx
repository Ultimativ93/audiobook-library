import React, { useState, useEffect, useRef } from 'react';

import './player.css';
import FetchFlow from '../../components/tasks/playerTasks/FetchFlow';
import LayoutEditorLinks from '../../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorLinks';
import PlayerAnswers from '../../components/layoutComponents/layoutPlayer/PlayerAnswers';
import PlayerEnd from '../../components/layoutComponents/layoutPlayer/playerEnd/PlayerEnd';
import PlayerInput from '../../components/layoutComponents/layoutPlayer/playerInput/PlayerInput';
import PlayerMuAns from '../../components/layoutComponents/layoutPlayer/PlayerMuAns';
import PlayerReaction from '../../components/layoutComponents/layoutPlayer/PlayerReaction';
import PlayerTime from '../../components/layoutComponents/layoutPlayer/playerTime/PlayerTime';

import { getAudioPathFromName, getAudioFromPath, handleAudioEnded } from '../../components/tasks/playerTasks/PlayerLogic';

const Player = () => {
  const [flow, setFlow] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentNode, setCurrentNode] = useState(1);
  const [currentNodeProps, setCurrentNodeProps] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef();

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
        console.log("currentNode", flow.nodes[currentNode].data.id);
        setCurrentNodeProps(flow.nodes[currentNode].data);
      }
    };

    fetchData();
  }, [currentNode, flow]);

  if (currentNodeProps) {
    //console.log("CurrentNode Player: ", flow.nodes[currentNode])
  }

  useEffect(() => {
    const audioElement = audioRef.current;
  
    if (audioElement) {
      const handleTimeUpdate = (e) => {
        const newTime = e.target.currentTime;
        setCurrentTime(newTime);
      };
  
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
  
      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [audioRef, currentNodeProps, flow]);



  return (
    <>
      <LayoutEditorLinks />
      <div className="player-wrapper">

        {currentNodeProps && (
          <div>
            Label: {currentNodeProps.label}
          </div>
        )}

        {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'muChoi' && (
          <PlayerAnswers currentNodeProps={currentNodeProps} flow={flow} setCurrentNode={setCurrentNode} />
        )}

        <PlayerEnd currentNodeProps={currentNodeProps} flow={flow} setCurrentNode={setCurrentNode} />

        {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'inputNode' && (
          <PlayerInput currentNodeProps={currentNodeProps} flow={flow} setCurrentNode={setCurrentNode} />
        )}

        {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'muAns' && (
          <PlayerMuAns currentNodeProps={currentNodeProps} flow={flow} setCurrentNode={setCurrentNode} />
        )}

        {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'reactNode' && (
          <PlayerReaction
            currentNodeProps={currentNodeProps}
            flow={flow}
            setCurrentNode={setCurrentNode}
            onTimeUpdate={currentTime}
          />
        )}

        {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'timeNode' && (
          <PlayerTime 
            currentNodeProps={currentNodeProps}
            flow={flow}
            setCurrentNode={setCurrentNode}
            onTimeUpdate={currentTime}
          />
        )}

          <div className="player">
            {audioBlob && (
              <audio
                ref={audioRef}
                controls
                src={audioBlob}
                onEnded={() => handleAudioEnded(currentNodeProps, flow, setCurrentNode)}
              />
            )}
          </div>
      </div>
    </>
  );
};

export default Player;
