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

// Player component, plays validated flow, also if a selectedNode gets passed to it, it starts with the selected node. Is used in "Audiobook.jsx", aswell as in "LayoutMenuModalPreview.jsx"
// where it allows the creator to check the playable flow for errors or different mistakes.
const Player = ({ selectedNodes }) => {
  const [flow, setFlow] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentNode, setCurrentNode] = useState(1);
  const [currentNodeProps, setCurrentNodeProps] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [answerAudioIndex, setAnswerAudioIndex] = useState(0);
  const [backgroundAudio, setBackgroundAudio] = useState(null);
  const [answerProcessAudio, setAnswerProcessAudio] = useState(null);
  const [answerProcessBackgroundAudio, setAnswerProcessBackgroundAudio] = useState(null);
  const [answerProcessAudioPlaying, setAnswerProcessAudioPlaying] = useState(null);

  const [questionAudioPlayed, setQuestionAudioPlayed] = useState(false);
  const [interactionSignalPlayed, setInteractionSignalPlayed] = useState(false);
  const [answerProcessAudioPlayed, setAnswerProcessAudioPlayed] = useState(false);
  const [answerProcessAnswersAudioPlayed, setAnswerProcessAnswersAudioPlayed] = useState(false);
  const [backgroundAudioPlayed, setBackgroundAudioPlayed] = useState(false);
  const [isInValidPeriod, setIsInValidPeriod] = useState(false);
  const [firstNodePlayed, setFirstNodePlayed] = useState(false);
  const [index, setIndex] = useState(0);

  const audioRef = useRef();
  const backgroundAudioRef = useRef();
  const answerProcessAudioRef = useRef();
  const answerProcessBackgroundAudioRef = useRef();

  const location = useLocation();
  const flowKey = decodeURIComponent(location.pathname.split('/').pop()).replace(/%20/g, ' ').substring(0);

  // Set the flowkey to the query, and fetch the flow from the server.
  useEffect(() => {
    FetchFlow(flowKey).then((flowData) => {
      setFlow(flowData);
    });
  }, []);

  // Set the currentNodeProps after first node after the startnode
  useEffect(() => {
    const fetchData = async () => {
      if (flow != null && flow.nodes != null && flow.nodes.length > 1 && currentNode != null) {
        const path = await getAudioPathFromName(flow.nodes[currentNode].data.audioStory, flowKey);
        const audioBlobResponse = await getAudioFromPath(path);
        setAudioBlob(audioBlobResponse);
        setCurrentNodeProps(flow.nodes[currentNode].data);

        await loadBackgroundAudio(flow.nodes[currentNode].data, 'audioStory');
        setQuestionAudioPlayed(false);
        setInteractionSignalPlayed(false);
        setAnswerProcessAudioPlayed(false);
        setAnswerProcessAnswersAudioPlayed(false);
        setBackgroundAudioPlayed(false);
        setAnswerProcessAudioPlaying(false);
        setIsInValidPeriod(false);

        setAnswerProcessAudio(null);
        setAnswerProcessBackgroundAudio(null);
        setBackgroundAudio(null);
        setIndex(0);

        answerProcessAudioRef.current.src = null;
      }
    };

    fetchData();
  }, [currentNode, flow]);

  // Set the current Node to the node connected with the start node
  useEffect(() => {
    const fetchData = async () => {
      if ((selectedNodes && selectedNodes.length && selectedNodes.length > 0) && flow != null && flow.nodes != null && flow.nodes.length > 1) {
        const selectedNodeIndex = flow.nodes.findIndex(node => node.id === selectedNodes[0]);
        if (selectedNodeIndex !== -1) {
          setCurrentNode(selectedNodeIndex);
          const path = await getAudioPathFromName(flow.nodes[selectedNodeIndex].data.audioStory, flowKey);
          const audioBlobResponse = await getAudioFromPath(path);
          setAudioBlob(audioBlobResponse);
          setCurrentNodeProps(flow.nodes[selectedNodeIndex].data);
        } else {
          console.error('Selected node not found in the flow');
        }
      } else if (flow != null && flow.nodes != null && flow.nodes.length > 1 && currentNode != null) {
        const startNode = flow.nodes.find(node => node.id === '1');
        if (startNode) {
          const connectedEdge = flow.edges.find(edge => edge.source === startNode.id);
          if (connectedEdge) {
            const connectedNode = flow.nodes.find(node => node.id === connectedEdge.target);
            if (connectedNode) {
              const connectedNodeIndex = flow.nodes.findIndex(node => node.id === connectedNode.id);
              setCurrentNode(connectedNodeIndex);
              const path = await getAudioPathFromName(flow.nodes[connectedNodeIndex].data.audioStory, flowKey);
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
  const handleSpecialCasesNoAnswer = (targetNodeType) => {
    if (targetNodeType === 'bridgeNode') {
      handleButtonClickLogic(0, flow, currentNodeProps, setCurrentNode);
    } else if (targetNodeType === 'reactNode') {
      const lastPeriodIndex = currentNodeProps.answerPeriods.length;
      handleButtonClickLogic(lastPeriodIndex, flow, currentNodeProps, setCurrentNode);
    } else if (targetNodeType === 'timeNode' && questionAudioPlayed) {
      const lastAnswerIndex = currentNodeProps.answers.length - 1;
      handleButtonClickLogic(lastAnswerIndex, flow, currentNodeProps, setCurrentNode);
    } else {
      console.log('Error in handleSpecialCasesAnswers, no fitting case.')
    }
  }

  // Play question Audio for and set answers visible after question audio played
  const playQuestionAudio = async () => {
    const questionAudioPath = await getAudioPathFromName(currentNodeProps.questionAudio, flowKey);
    const questionAudioBlob = await getAudioFromPath(questionAudioPath);
    await loadBackgroundAudio(flow.nodes[currentNode].data, 'questionAudio');
    if (questionAudioBlob && (!questionAudioPlayed || currentNodeProps.repeatQuestionAudio === 'true')) {
      audioRef.current.src = questionAudioBlob;
      audioRef.current.play();
      setQuestionAudioPlayed(true);
      setAnswersVisible(true);
    } else {
      console.log('Question audio could not be played or already played.');
    }
  };

  // Play AnswerProcessAudio in TimeNode and ReactionNode
  const playAnswerProcessAudio = async () => {
    if (currentNodeProps.answerProcessAudio && !answerProcessAudioPlayed) {
      setAnswerProcessAudio(null);
      setAnswerProcessBackgroundAudio(null);

      const answerProcessAudioPath = await getAudioPathFromName(currentNodeProps.answerProcessAudio, flowKey);
      const answerProcessAudioBlob = await getAudioFromPath(answerProcessAudioPath);
      await loadBackgroundAudio(flow.nodes[currentNode].data, 'answerProcessAudio');
      const targetNodeIndex = flow.nodes.findIndex((node) => node.id === currentNodeProps.id);
      const targetNodeType = flow.nodes[targetNodeIndex].type;

      if (targetNodeType === 'timeNode') {
        playAnswerProcessAnswersTime();
      }

      if (answerProcessAudioBlob) {
        audioRef.current.src = answerProcessAudioBlob;
        audioRef.current.play();
        setAnswerProcessAudioPlayed(true);
        setAnswerProcessAudioPlaying(true);
      }
    }
  };

  // Play Interaction Signal if selected
  const playInteractionSignal = async () => {
    if (currentNodeProps.interactionSignal === 'true' && currentNodeProps.interactionSignalAudio) {
      const interactionSignalAudioPath = await getAudioPathFromName(currentNodeProps.interactionSignalAudio, flowKey);
      const interactionSignalAudioBlob = await getAudioFromPath(interactionSignalAudioPath);
      await loadBackgroundAudio(flow.nodes[currentNode].data, 'interactionSignal')

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
      const answerAudioPath = await getAudioPathFromName(currentNodeProps.answerAudios[answerAudioIndex], flowKey);
      const answerAudioBlob = await getAudioFromPath(answerAudioPath)
      await loadBackgroundAudio(flow.nodes[currentNode].data, `answer-${answerAudioIndex}`);

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
      setFirstNodePlayed(true);

      // Check if all answer audios have been played
      if ((questionAudioPlayed && (currentNodeProps && currentNodeProps.answerAudios && answerAudioIndex === currentNodeProps.answerAudios.length)) || (questionAudioPlayed && currentNodeProps.correctAnswer)) {
        if (currentNodeProps.repeatQuestionAudio === 'true') {
          setQuestionAudioPlayed(false);
          playQuestionAudio();
          setAnswerAudioIndex(0);
        } else {
          console.log('All answer audios played.');
        }
      } else {
        // If is not an end, play answers, question and interaction Signal
        if (currentNodeProps.isEnd !== 'true') {
          // Play next answer audio
          if ((targetNodeType !== 'bridgeNode' && targetNodeType !== 'muChoi') && (!answerProcessAudioPlayed && (questionAudioPlayed && (targetNodeType === 'reactNode' || targetNodeType === 'timeNode')))) {
            playAnswerProcessAudio()
          } else if (targetNodeType === 'bridgeNode' || (answerProcessAudioPlayed && (questionAudioPlayed && (targetNodeType === 'reactNode' || targetNodeType === 'timeNode')))) {
            handleSpecialCasesNoAnswer(targetNodeType);
          } else if (questionAudioPlayed) {
            playAnswerAudio();
          } else if (!questionAudioPlayed && interactionSignalPlayed) {
            playQuestionAudio();
          } else if (!questionAudioPlayed && (currentNodeProps.interactionSignal === 'false' || currentNodeProps.interactionSignal === '')) {
            playQuestionAudio();
          } else {
            playInteractionSignal();
          }
        }
      }
    }
  };

  useEffect(() => {
    setQuestionAudioPlayed(false);
    setAnswersVisible(false);
    setAnswerAudioIndex(0);
    setInteractionSignalPlayed(false);
  }, [currentNode]);

  const loadBackgroundAudio = async (node, bgAudioToLoad) => {
    if (node && node.backgroundAudio && node.backgroundAudio.length > 0) {
      const relevantBackgroundAudio = node.backgroundAudio.find(bgAudio => {
        return bgAudio.audio === bgAudioToLoad;
      })
      if (relevantBackgroundAudio) {
        const backgroundAudioPath = await getAudioPathFromName(relevantBackgroundAudio.backgroundAudio, flowKey);
        const backgroundAudioBlob = await getAudioFromPath(backgroundAudioPath);
        // Checking for Time Node, to set answerBackgroundAudio
        setBackgroundAudio(backgroundAudioBlob);
      } else {
        setBackgroundAudio(null);
      }
    }
  }

  const loadAnswerProcessBackgroundAudio = async (node, bgAudioToLoad) => {
    if (node && node.backgroundAudio && node.backgroundAudio.length > 0) {
      const relevantBackgroundAudio = node.backgroundAudio.find(bgAudio => {
        return bgAudio.audio === bgAudioToLoad;
      })
      if (relevantBackgroundAudio) {
        const answerProcessBackgroundAudioPath = await getAudioPathFromName(relevantBackgroundAudio.backgroundAudio, flowKey);
        const answerProcessBackgroundAudioBlob = await getAudioFromPath(answerProcessBackgroundAudioPath);
        if (answerProcessBackgroundAudioBlob) {
          setAnswerProcessBackgroundAudio(answerProcessBackgroundAudioBlob);
          return true;
        }
      } else {
        setAnswerProcessBackgroundAudio(null);
        return false;
      }
    }
    return false;
  }

  // Plays Answer Process Asnwers Time
  const playAnswerProcessAnswersTime = async () => {
    if (currentNodeProps && currentNodeProps.answerAudios && currentNodeProps.answerAudios.length > 0) {
      const answerAudios = currentNodeProps.answerAudios;
      let index = 0;

      const playNextAnswer = async () => {
        if (index < answerAudios.length) {
          const answerAudioPath = await getAudioPathFromName(answerAudios[index], flowKey);
          const answerAudioBlob = await getAudioFromPath(answerAudioPath);

          const loadedAnswerProcessBackgroundAudio = await loadAnswerProcessBackgroundAudio(flow.nodes[currentNode].data, `answer-${index}`);

          if (answerAudioBlob && questionAudioPlayed) {
            answerProcessAudioRef.current.src = answerAudioBlob;
            answerProcessAudioRef.current.play();
            if (loadedAnswerProcessBackgroundAudio) {
              answerProcessBackgroundAudioRef.current.oncanplaythrough = () => {
                answerProcessBackgroundAudioRef.current.play();
              };
            }

            await new Promise(resolve => {
              answerProcessAudioRef.current.onended = resolve;
              answerProcessBackgroundAudioRef.current.onended = resolve;
            });

            index++;
            playNextAnswer();
          }
        } else {
          setAnswerProcessAnswersAudioPlayed(true);
        }
      };

      playNextAnswer();
    }
  };

  // Set IsInValidPeriod on Period change
  const onValidPeriodChange = (isValidPeriod) => {
    setIsInValidPeriod(isValidPeriod);
  };

  useEffect(() => {
    playAnswerProcessAnswersReaction();
  }, [isInValidPeriod])

  // Play AnswerProcessAnswersReaction
  const playAnswerProcessAnswersReaction = async () => {
    if ((currentNodeProps && currentNodeProps.answerAudios && currentNodeProps.answerAudios.length > 0) && isInValidPeriod) {
      const answerAudios = currentNodeProps.answerAudios;

      if (index < answerAudios.length) {
        const answerAudioPath = await getAudioPathFromName(answerAudios[index], flowKey);
        const answerAudioBlob = await getAudioFromPath(answerAudioPath);

        const loadedAnswerProcessBackgroundAudio = await loadAnswerProcessBackgroundAudio(flow.nodes[currentNode].data, `answer-${index}`);
        if (answerAudioBlob && questionAudioPlayed) {
          answerProcessAudioRef.current.src = answerAudioBlob;
          answerProcessAudioRef.current.play();

          if (loadedAnswerProcessBackgroundAudio) {
            answerProcessBackgroundAudioRef.current.oncanplaythrough = () => {
              answerProcessBackgroundAudioRef.current.play();
            }
          }
        }

        await new Promise(resolve => {
          answerProcessAudioRef.current.onended = resolve;
          answerProcessBackgroundAudioRef.current.onended = resolve;
        });

        setIndex(index + 1);
      }
    }
  };

  // Play background audio
  const playBackgroundAudio = async () => {
    const backgroundAudioElement = backgroundAudioRef.current;
    if (backgroundAudioElement && !backgroundAudioPlayed) {
      backgroundAudioElement.play();
    }

    const answerProcessAudioElement = answerProcessAudioRef.current;
    if (answerProcessAudioElement && questionAudioPlayed && answerProcessAudioPlayed && !answerProcessAnswersAudioPlayed) {
      answerProcessAudioElement.play();
    }

    const answerProcessBackgroundAudioElement = answerProcessBackgroundAudioRef.current;
    if (answerProcessBackgroundAudioElement && questionAudioPlayed && answerProcessAudioPlayed && !answerProcessAnswersAudioPlayed) {
      answerProcessBackgroundAudioElement.play();
    }
  };

  // Handle stop background audio
  const stopBackgroundAudio = () => {
    const backgroundAudioElement = backgroundAudioRef.current;
    if (backgroundAudioElement) {
      backgroundAudioElement.pause();
    }

    const answerProcessAudioElement = answerProcessAudioRef.current;
    if (answerProcessAudioElement) {
      answerProcessAudioElement.pause();
    }

    const answerProcessBackgroundAudioElement = answerProcessBackgroundAudioRef.current;
    if (answerProcessBackgroundAudioElement) {
      answerProcessBackgroundAudioElement.pause();
    }
  };

  // Handle Audio ended stop background audio
  const handleAudioEndedWithBackgroundStop = () => {
    handleAudioEnded(currentNodeProps, flow, setCurrentNode);
    stopBackgroundAudio();
    setBackgroundAudio(null);
    setAnswerProcessBackgroundAudio(null);
    setAnswerProcessAudio(null);
  };

  return (
    <div className='player-wrapper'>
      {currentNodeProps && (
        <div className='player-wrapper-label'>
          Label: {currentNodeProps.label}
        </div>
      )}

      <div className='background-audio'>
        {backgroundAudio && (
          <audio
            ref={backgroundAudioRef}
            src={backgroundAudio}
            onEnded={() => setBackgroundAudioPlayed(true)}
            loop
          />
        )}
      </div>

      <div className='answer-process-audio'>
        <audio
          ref={answerProcessAudioRef}
          src={answerProcessAudio}
        />
      </div>

      <div className='answer-process-background-audio'>
        <audio
          ref={answerProcessBackgroundAudioRef}
          src={answerProcessBackgroundAudio}
          loop
        />
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
          setFirstNodePlayed={setFirstNodePlayed}
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
          answerProcessAudioPlaying={answerProcessAudioPlaying}
          onValidPeriodChange={onValidPeriodChange}
          visible={answersVisible}
        />
      )}

      {flow && flow.nodes && flow.nodes[currentNode] && flow.nodes[currentNode].type === 'timeNode' && (
        <PlayerTime
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
          onTimeUpdate={currentTime}
          visible={answersVisible}
          answerProcessAudioPlaying={answerProcessAudioPlaying}
        />
      )}

      <div className='player'>
        {audioBlob && (
          <audio
            ref={audioRef}
            controls
            controlsList='nodownload'
            autoPlay={firstNodePlayed}
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