import React from 'react'
import ReactAudioPlayer from 'react-audio-player';

import './player.css';
import FetchFlow from '../../components/tasks/FetchFlow';

const Player = () => {
  return (
    <div className="player-wrapper">
      <div>Other Content</div>
      <div className="player">
        <ReactAudioPlayer
          autoPlay
          controls
        />
        {/*<FetchFlow flowKey={'First-trys'}/>*/}
      </div>
    </div>
  )
}

export default Player