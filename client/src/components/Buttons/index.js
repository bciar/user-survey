import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';

import './index.scss';

const Buttons = props => {
  const { question, backClick, forwardClick, inactive } = props;
  let nextButtonText = 'Next';
  if (question.button) nextButtonText = question.button;
  return (
    <div className="survey-button-wrapper">
      {question.id > 1 && 
        <Button 
          className="back" 
          text="Back" 
          handleClick={backClick} 
        />
       }
      <Button 
        className="next" 
        text={nextButtonText} 
        handleClick={forwardClick} 
        inactive={inactive} 
      />
    </div>
  )
}

Buttons.propTypes = {
  question: PropTypes.object,
  backClick: PropTypes.func,
  forwardClick: PropTypes.func,
  inactive: PropTypes.bool,
}

export default Buttons;
