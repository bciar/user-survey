import React from 'react';
import propTypes from 'prop-types';

import './index.scss';

const Video = props => {
  return (
    <div className="video-container">
      <div className="player-wrapper">
        <video
          src={props.url}
          className="video-player"
          height="100%"
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
}

Video.propTypes = {
  url: propTypes.string.isRequired,
}

export default Video;
