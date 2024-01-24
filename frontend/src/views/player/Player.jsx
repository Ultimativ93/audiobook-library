import React from 'react'
import ReactAudioPlayer from 'react-audio-player';

import './player.css';

const Player = () => {
  return (
    <div className="player-wrapper">
      <div>Other Content</div>
      <div className="player">
        <ReactAudioPlayer
          autoPlay
          controls
        />
      </div>
    </div>
  )
}

export default Player