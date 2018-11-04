import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Label = props => {
  const { question, number } = props;
  const labelClassNames = classNames({
    'question-label': true,
    [`question-label-${question.name}`]: true,
    'single-question-label': props.number === 'single',
    'multi-question-label': props.number === 'multiple',
  })

  return (
    <label dangerouslySetInnerHTML={{__html: question.text}} className={labelClassNames}></label>
  );
}

Label.propTypes = {
  question: PropTypes.object.isRequired,
  number: PropTypes.string.isRequired,
}
 
export default Label;
