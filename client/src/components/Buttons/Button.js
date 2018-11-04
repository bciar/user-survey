import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.scss';

const Button = props => {
  const { text, className, inactive, handleClick } = props;
  const buttonClassNames = classNames({
    [`button-${className}`]: true,
    'button-inactive': inactive,
  });

  return (
    <button onClick={props.handleClick} className={buttonClassNames}>
      {props.text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string,
  handleClick: PropTypes.func,
  className: PropTypes.string,
  inactive: PropTypes.bool,
}

export default Button;

