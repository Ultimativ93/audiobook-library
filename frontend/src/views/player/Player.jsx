import React, { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

import './player.css';
import FetchFlow from '../../components/tasks/playerTasks/FetchFlow';
import LayoutEditorLinks from '../../components/layoutComponents/layoutEditor/editorComponents/LayoutEditorLinks';
import PlayerAnswers from '../../components/layoutComponents/layoutPlayer/PlayerAnswers';
import PlayerEnd from '../../components/layoutComponents/layoutPlayer/playerEnd/PlayerEnd';

import { getAudioPathFromName, getAudioFromPath, handleAudioEnded } from '../../components/tasks/playerTasks/PlayerLogic';

const Player = () => {
  const [flow, setFlow] = useState(null);
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
        const audioBlobResponse = await getAudioFromPath(path);
        setAudioBlob(audioBlobResponse);
        console.log("currentNode", flow.nodes[currentNode].data.id);
        setCurrentNodeProps(flow.nodes[currentNode].data);
      }
    };

    fetchData();
  }, [currentNode, flow]);

  if (currentNodeProps) {
    console.log("CurrentNode Player: ", flow.nodes[currentNode])
  }


  return (
    <>
      <LayoutEditorLinks />
      <div className="player-wrapper">

        {currentNodeProps && (
          <div>
            Label: {currentNodeProps.label}
          </div>)}

        <PlayerAnswers currentNodeProps={currentNodeProps} flow={flow} setCurrentNode={setCurrentNode} />
        <PlayerEnd currentNodeProps={currentNodeProps} flow={flow} setCurrentNode={setCurrentNode} />

        <div className="player">

          {audioBlob && (
            <ReactAudioPlayer controls src={audioBlob} onEnded={() => handleAudioEnded(currentNodeProps, flow, setCurrentNode)}/>
          )}

        </div>

      </div>
    </>
  );
};

export default Player;
