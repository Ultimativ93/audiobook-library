import React, { useState, useEffect, useRef } from 'react';

import './player.css';

import FetchFlow from '../../components/tasks/playerTasks/FetchFlow';
import LayoutLinks from '../../components/layoutComponents/layoutCommon/layoutLinks/LayoutLinks';
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
  const audioRef = useRef();

  // Here we will have to change the flowKey to the flowkey we want to access !!!!!
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

  const playQuestionAudio = async () => {
    const questionAudioPath = await getAudioPathFromName(currentNodeProps.questionAudio);
    const questionAudioBlob = await getAudioFromPath(questionAudioPath);

    if (questionAudioBlob && !questionAudioPlayed) {
      audioRef.current.src = questionAudioBlob;
      audioRef.current.play();
      setQuestionAudioPlayed(true);
      setAnswersVisible(true);
      console.log("Question Played", questionAudioPlayed);
    }
  }

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

  const handleAudioEnded = () => {
    if (flow && flow.nodes) {
      const targetNodeIndex = flow.nodes.findIndex((node) => node.id === currentNodeProps.id);
      console.log("TargetNodeIndex", targetNodeIndex)
      const targetNodeType = flow.nodes[targetNodeIndex].type;
      console.log("TargetNodeType", targetNodeType);
      console.log("questionAudioPlay", questionAudioPlayed);

      if (targetNodeType === 'bridgeNode' || (questionAudioPlayed && (targetNodeType === 'reactNode' || targetNodeType === 'timeNode'))) {
        console.log("before return specialCases")
        handleSpecialCasesAnswers(targetNodeType);
      } else if (questionAudioPlayed) {
        playAnswerAudio();
      } else {
        playQuestionAudio();
      }
    }
  }

  useEffect(() => {
    setQuestionAudioPlayed(false);
    setAnswersVisible(false);
    setAnswerAudioIndex(0);
  }, [currentNode]);

  return (
    <>
      <LayoutLinks />

      <div className="player-wrapper">
        {currentNodeProps && (
          <div className="player-wrapper-label">
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
              onEnded={() => handleAudioEnded(currentNodeProps, flow, setCurrentNode)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Player;
