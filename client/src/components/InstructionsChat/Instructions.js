import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Instructions = props => (
  <div className="instructions">
    {props.text}
  </div>
);

Instructions.propTypes = {
  text: PropTypes.string.isRequired,
}

export default Instructions;
