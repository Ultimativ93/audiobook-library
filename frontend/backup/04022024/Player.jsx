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

import { getAudioPathFromName, getAudioFromPath, handleButtonClickLogic } from '../../components/tasks/playerTasks/PlayerLogic';

const Player = () => {
  const [flow, setFlow] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentNode, setCurrentNode] = useState(1);
  const [currentNodeProps, setCurrentNodeProps] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [questionAudioPlayed, setQuestionAudioPlayed] = useState(false);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [lastPlayedAudioSrc, setLastPlayedAudioSrc] = useState(null);
  const [currentAudioSrc, setCurrentAudioSrc] = useState(null);
  const audioRef = useRef();

  useEffect(() => {
    const flowKey = 'First-trys';
    FetchFlow(flowKey).then((flowData) => {
      setFlow(flowData);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (flow != null && flow.nodes != null && flow.nodes.length > 1 && currentNode != null) {
        const path = await getAudioPathFromName(flow.nodes[currentNode].data.audioStory);
        const audioBlobResponse = await getAudioFromPath(path);
        setAudioBlob(audioBlobResponse);
        setCurrentNodeProps(flow.nodes[currentNode].data);
      }
    };

    fetchData();
  }, [currentNode, flow]);

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

  const handleAudioEnded = async () => {
    if (flow && flow.nodes) {
      const targetNodeIndex = flow.nodes.findIndex((node) => node.id === currentNodeProps.id);

      if (targetNodeIndex !== -1) {
        const targetNodeType = flow.nodes[targetNodeIndex].type;

        if (targetNodeType === 'bridgeNode') {
          handleButtonClickLogic(0, flow, currentNodeProps, setCurrentNode);
        } else if (targetNodeType === 'reactNode') {
          const lastPeriodIndex = currentNodeProps.answerPeriods.length;
          handleButtonClickLogic(lastPeriodIndex, flow, currentNodeProps, setCurrentNode);
        } else if (targetNodeType === 'timeNode' && questionAudioPlayed) {
          const lastAnswerIndex = currentNodeProps.answers.length - 1;
          handleButtonClickLogic(lastAnswerIndex, flow, currentNodeProps, setCurrentNode);
        }

        if (targetNodeType !== 'bridgeNode' && !questionAudioPlayed) {
          const questionAudioPath = await getAudioPathFromName(currentNodeProps.questionAudio);
          const questionAudioBlob = await getAudioFromPath(questionAudioPath);

          if (questionAudioBlob) {
            audioRef.current.src = questionAudioBlob;

            if (
              currentNodeProps.questionAudio !== lastPlayedAudioSrc &&
              currentNodeProps.questionAudio !== currentAudioSrc
            ) {
              audioRef.current.addEventListener('loadedmetadata', () => {
                audioRef.current.play();
                setQuestionAudioPlayed(true);
                setAnswersVisible(true);
                setLastPlayedAudioSrc(currentNodeProps.questionAudio);
                setCurrentAudioSrc(currentNodeProps.questionAudio);
                console.log("setQuestionPlayed:", questionAudioPlayed);
              }, { once: true });
            }
          }

          console.log("TargetNodeType", targetNodeType);
          if (targetNodeType === 'muChoi' && questionAudioPlayed) {
            console.log("Ist MuChoi: ");
            if (currentNodeProps.answerAudios && currentNodeProps.answerAudios.length > 0) {
              for (let i = 0; i < currentNodeProps.answerAudios.length; i++) {
                const answerAudioPath = await getAudioPathFromName(currentNodeProps.answerAudios[i]);
                const answerAudioBlob = await getAudioFromPath(answerAudioPath);
                console.log("answerAudioPath", answerAudioPath);

                if (answerAudioBlob) {
                  audioRef.current.src = answerAudioBlob;

                  await new Promise(resolve => {
                    audioRef.current.addEventListener('ended', () => {
                      resolve();
                    }, { once: true });

                    if (
                      currentNodeProps.answerAudios[i] !== lastPlayedAudioSrc &&
                      currentNodeProps.answerAudios[i] !== currentAudioSrc
                    ) {
                      audioRef.current.play();
                      setAnswersVisible(true);
                      setLastPlayedAudioSrc(currentNodeProps.answerAudios[i]);
                      setCurrentAudioSrc(currentNodeProps.answerAudios[i]);
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    setQuestionAudioPlayed(false);
    setAnswersVisible(false);
  }, [currentNode]);

  if (currentNodeProps && currentAudioSrc) {
    //console.log("CurrentNodeProps: ", currentNodeProps);
    console.log("CurrentAuidoSrc: ", currentAudioSrc);
  }

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
          <PlayerAnswers
            currentNodeProps={currentNodeProps}
            flow={flow}
            setCurrentNode={setCurrentNode}
            visible={answersVisible}
          />
        )}

        <PlayerEnd
          currentNodeProps={currentNodeProps}
          flow={flow}
          setCurrentNode={setCurrentNode}
        />

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
              onEnded={() => handleAudioEnded(currentNodeProps, flow, setCurrentNode)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Player;
