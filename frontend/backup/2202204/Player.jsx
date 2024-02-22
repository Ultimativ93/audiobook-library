import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import './player.css';

import FetchFlow from '../../components/tasks/playerTasks/FetchFlow';
import PlayerAnswers from '../../components/layoutComponents/layoutPlayer/PlayerAnswers';
import PlayerEnd from '../../components/layoutComponents/layoutPlayer/playerEnd/PlayerEnd';
import PlayerInput from '../../components/layoutComponents/layoutPlayer/playerInput/PlayerInput';
import PlayerMuAns from '../../components/layoutComponents/layoutPlayer/PlayerMuAns';
import PlayerReaction from '../../components/layoutComponents/layoutPlayer/PlayerReaction';
import PlayerTime from '../../components/layoutComponents/layoutPlayer/playerTime/PlayerTime';

import { getAudioPathFromName, getAudioFromPath, handleButtonClickLogic } from '../../components/tasks/playerTasks/PlayerLogic';

const Player = () => {
  const [flow, setFlow] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentNode, setCurrentNode] = useState(1);
  const [currentNodeProps, setCurrentNodeProps] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [questionAudioPlayed, setQuestionAudioPlayed] = useState(false);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [answerAudioIndex, setAnswerAudioIndex] = useState(0);
  const [interactionSignalPlayed, setInteractionSignalPlayed] = useState(false);
  const [backgroundAudio, setBackgroundAudio] = useState(null);

  const audioRef = useRef();
  const backgroundAudioRef = useRef();
  const location = useLocation();

  console.log("Flow", flow);

  // Set the flowkey to the query, and fetch the flow from the server. Add validation for this case !!!!!
  useEffect(() => {
    const flowKey = location.pathname.split('/').pop();
    console.log("Flowkey im Player: ", flowKey);
    FetchFlow(flowKey).then((flowData) => {
      setFlow(flowData);
    });
  }, []);

  // Set the currentNodeProps after first node after the startnode
  useEffect(() => {
    const fetchData = async () => {
      if (flow != null && flow.nodes != null && flow.nodes.length > 1 && currentNode != null) {
        const path = await getAudioPathFromName(flow.nodes[currentNode].data.audioStory);
        const audioBlobResponse = await getAudioFromPath(path);
        setAudioBlob(audioBlobResponse);
        setCurrentNodeProps(flow.nodes[currentNode].data);

        console.log("!!!!!! Wir laden im useEffect !!!!!!!!")
        await loadBackgroundAudio(flow.nodes[currentNode].data);
      }
    };

    fetchData();
  }, [currentNode, flow]);

  // Set the current Node to the node connected with the start node
  useEffect(() => {
    const fetchData = async () => {
      if (flow != null && flow.nodes != null && flow.nodes.length > 1 && currentNode != null) {
        const startNode = flow.nodes.find(node => node.id === '1');
        if (startNode) {
          const connectedEdge = flow.edges.find(edge => edge.source === startNode.id);
          if (connectedEdge) {
            const connectedNode = flow.nodes.find(node => node.id === connectedEdge.target);
            if (connectedNode) {
              const connectedNodeIndex = flow.nodes.findIndex(node => node.id === connectedNode.id);
              setCurrentNode(connectedNodeIndex);
              const path = await getAudioPathFromName(flow.nodes[connectedNodeIndex].data.audioStory);
              const audioBlobResponse = await getAudioFromPath(path);
              setAudioBlob(audioBlobResponse);
              setCurrentNodeProps(flow.nodes[connectedNodeIndex].data);
            }
          }
        }
      }
    };

    fetchData();
  }, [flow]);

  // Handle timecount for timeNode and reactionNode
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

  // Handle specialcases like, bridge, react, time
  const handleSpecialCasesAnswers = (targetNodeType) => {
    console.log("TargetNode in SCA:", targetNodeType)
    if (targetNodeType === 'bridgeNode') {
      handleButtonClickLogic(0, flow, currentNodeProps, setCurrentNode);
    } else if (targetNodeType === 'reactNode') {
      const lastPeriodIndex = currentNodeProps.answerPeriods.length;
      handleButtonClickLogic(lastPeriodIndex, flow, currentNodeProps, setCurrentNode);
    } else if (targetNodeType === 'timeNode' && questionAudioPlayed) {
      const lastAnswerIndex = currentNodeProps.answers.length - 1;
      handleButtonClickLogic(lastAnswerIndex, flow, currentNodeProps, setCurrentNode);
    } else {
      console.log("Error in handleSpecialCasesAnswers, no fitting case.")
    }
  }

  // Play question Audio for and set answers visible after question audio played
  const playQuestionAudio = async () => {
    console.log("In Play Question")
    const questionAudioPath = await getAudioPathFromName(currentNodeProps.questionAudio);
    const questionAudioBlob = await getAudioFromPath(questionAudioPath);

    if (questionAudioBlob && (!questionAudioPlayed || currentNodeProps.repeatQuestionAudio === "true")) {
      audioRef.current.src = questionAudioBlob;
      audioRef.current.play();
      console.log("Question audio is playing...");
      setQuestionAudioPlayed(true);
      setAnswersVisible(true);
    } else {
      console.log("Question audio could not be played or already played.");
    }
  }

  // Play Interaction Signal if selected
  const playInteractionSignal = async () => {
    if (currentNodeProps.interactionSignal === "true" && currentNodeProps.interactionSignalAudio) {
      const interactionSignalAudioPath = await getAudioPathFromName(currentNodeProps.interactionSignalAudio);
      const interactionSignalAudioBlob = await getAudioFromPath(interactionSignalAudioPath);

      if (interactionSignalAudioBlob) {
        audioRef.current.src = interactionSignalAudioBlob;
        audioRef.current.play();
        setInteractionSignalPlayed(true);
      }
    }
  }

  // Plays the answer audios in a queue
  const playAnswerAudio = async () => {
    if (currentNodeProps.answerAudios && (currentNodeProps.answerAudios.length > answerAudioIndex)) {
      const answerAudioPath = await getAudioPathFromName(currentNodeProps.answerAudios[answerAudioIndex]);
      const answerAudioBlob = await getAudioFromPath(answerAudioPath)

      if (answerAudioBlob && questionAudioPlayed) {
        audioRef.current.src = answerAudioBlob;
        audioRef.current.play();
        setAnswerAudioIndex(answerAudioIndex + 1);
      }
    }
  }

  // Handling the end of an audio
  const handleAudioEnded = () => {
    if (flow && flow.nodes && currentNodeProps) {
      const targetNodeIndex = flow.nodes.findIndex((node) => node.id === currentNodeProps.id);
      const targetNodeType = flow.nodes[targetNodeIndex].type;

      console.log("In handleAudioEnded", questionAudioPlayed, currentNodeProps.interactionSignal)

      // Check if all answer audios have been played
      if (questionAudioPlayed && answerAudioIndex === currentNodeProps.answerAudios.length) {
        if (currentNodeProps.repeatQuestionAudio === "true") {
          console.log("Repeating question audio...");
          setQuestionAudioPlayed(false);
          console.log("questionAudioPlayed vor weiter:", questionAudioPlayed);
          playQuestionAudio();
          setAnswerAudioIndex(0);
        } else {
          console.log("All answer audios played.");
        }
      } else {
        console.log("Trying to play next answer questionPlayed: ", questionAudioPlayed)
        // Play next answer audio
        if (targetNodeType === 'bridgeNode' || (questionAudioPlayed && (targetNodeType === 'reactNode' || targetNodeType === 'timeNode'))) {
          handleSpecialCasesAnswers(targetNodeType);
        } else if (questionAudioPlayed) {
          playAnswerAudio();
        } else if (!questionAudioPlayed && interactionSignalPlayed) {
          playQuestionAudio();
        } else if (!questionAudioPlayed && (currentNodeProps.interactionSignal === 'false' || currentNodeProps.interactionSignal === '')) {
          console.log("play question")
          playQuestionAudio();
        } else {
          console.log("hier drin")
          playInteractionSignal();
        }
      }
    }
  }

  useEffect(() => {
    setQuestionAudioPlayed(false);
    setAnswersVisible(false);
    setAnswerAudioIndex(0);
    setInteractionSignalPlayed(false);
  }, [currentNode]);


  // Function to load and play background audio
  const loadBackgroundAudio = async (node) => {
    if (node && node.backgroundAudio && node.backgroundAudio.length > 0) {
      const relevantBackgroundAudio = node.backgroundAudio.find(bgAudio => {
        return bgAudio.audio === 'audioStory' || bgAudio.audio === `answer-${answerAudioIndex + 1}`;
      });
      console.log("RelevantBackgroundAudio", relevantBackgroundAudio);
      if (relevantBackgroundAudio) {
        const backgroundAudioPath = await getAudioPathFromName(relevantBackgroundAudio.backgroundAudio);
        const backgroundAudioBlob = await getAudioFromPath(backgroundAudioPath);
        setBackgroundAudio(backgroundAudioBlob);
      }
    }
  };

  const playBackgroundAudio = () => {
    const backgroundAudioElement = backgroundAudioRef.current;
    if (backgroundAudioElement) {
      console.log("Playing background audio...");
      backgroundAudioElement.play();
    }
  };

  const stopBackgroundAudio = () => {
    const backgroundAudioElement = backgroundAudioRef.current;
    if (backgroundAudioElement) {
      console.log("Stopping background audio...")
      backgroundAudioElement.pause();
    }
  }

  const handleAudioEndedWithBackgroundStop = () => {
    handleAudioEnded(currentNodeProps, flow, setCurrentNode);
    stopBackgroundAudio();
  };

  console.log("Backgroundaudioref", backgroundAudioRef);

  /*// Stop background Audio when normal audio player is paused
  useEffect(() => {
    const backgroundAudioElement = backgroundAudioRef.current;
    const audioElement = audioRef.current;

    const handleAudioPaused = () => {
      console.log("Normal audio player paused.");
      if (backgroundAudioElement && !backgroundAudioElement.paused) {
        console.log("Pausing background audio.");
        backgroundAudioElement.pause();
      }
    };

    const handleAudioEnded = () => {
      console.log("Normal audio player ended.");
      if (backgroundAudioElement && !backgroundAudioElement.paused) {
        console.log("Pausing background audio.");
        backgroundAudioElement.pause();
      }
    };

    if (audioElement) {
      audioElement.addEventListener('pause', handleAudioPaused);
      audioElement.addEventListener('ended', handleAudioEnded);
      return () => {
        audioElement.removeEventListener('pause', handleAudioPaused);
        audioElement.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, [audioRef.current, backgroundAudioRef]);

  // Play background Audio
  useEffect(() => {
    const backgroundAudioElement = backgroundAudioRef.current;
    if (backgroundAudioElement && backgroundAudio && !audioRef.current.paused) {
      if (backgroundAudioElement.paused) {
        backgroundAudioElement.src = backgroundAudio;
        backgroundAudioElement.play();
      }
    }

    return () => {
      if (backgroundAudioElement) {
        backgroundAudioElement.pause();
        backgroundAudioElement.src = "";
      }
    };
  }, [backgroundAudio]);
  */

  return (
    <div className="player-wrapper">
      {currentNodeProps && (
        <div className="player-wrapper-label">
          Label: {currentNodeProps.label}
        </div>
      )}

      <div className="background-audio">
        {backgroundAudio && (
          <audio
            ref={backgroundAudioRef}
            src={backgroundAudio}
            loop
          />
        )}
      </div>

      {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'muChoi' && (
        <PlayerAnswers
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
          visible={answersVisible}
        />
      )}

      {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'endNode' && (
        <PlayerEnd
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
        />
      )}


      {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'inputNode' && (
        <PlayerInput
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
          visible={answersVisible}
        />
      )}

      {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'muAns' && (
        <PlayerMuAns
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
          visible={answersVisible}
        />
      )}

      {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'reactNode' && (
        <PlayerReaction
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
          onTimeUpdate={currentTime}
          questionAudioPlayed={questionAudioPlayed}
        />
      )}

      {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'timeNode' && (
        <PlayerTime
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
          onTimeUpdate={currentTime}
          visible={answersVisible}
        />
      )}

      <div className="player">
        {audioBlob && (
          <audio
            ref={audioRef}
            controls
            src={audioBlob}
            onEnded={handleAudioEndedWithBackgroundStop}
            onPlay={() => playBackgroundAudio()}
            onPause={() => stopBackgroundAudio()}
          />
        )}
      </div>
    </div>
  );
};

export default Player;
