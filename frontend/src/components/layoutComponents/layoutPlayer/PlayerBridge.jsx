import React, { useEffect, useState } from 'react';
import { getCurrentAudioLength } from "../../tasks/playerTasks/PlayerLogic";

const PlayerBridge = ({ currentNodeProps, audioBlob }) => {
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (audioBlob && !audioPlayed) {
        const audioLength = await getCurrentAudioLength(audioBlob);
        console.log("Audio Length: ", audioLength);

        setAudioPlayed(true);
      }
    };

    fetchData();
  }, [audioBlob, currentNodeProps, audioPlayed]);

  return <></>;
};

export default PlayerBridge;
