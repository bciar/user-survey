import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import Input from '../Input';
import RadioButtons from '../RadioButtons';
import Checkboxes from '../Checkboxes';
import Button from '../Buttons/Button';

import getMappedQuestions from '../../utils/getMappedQuestions';
import data from '../../data/feedback.json';
import validate from '../../utils/validate';
import './index.scss';

const formName = 'feedback';

const { questions } = data;
getMappedQuestions(questions);

class FeedbackForm extends Component {

  renderInput = ({input, type, meta: {touched, error, warning}}) => (
    <div className="input-wrapper">
      <input {...input} type={type} />
      {touched &&
          ((error && <span className="error-message">{error}</span>) ||
            (warning && <span>{warning}</span>)
          )
      }
    </div>
  );

  render() {
    const { handleSubmit, onBlur, handleClick, onFocus } = this.props;

    return (
      <form
        className="feedback-form"
        name="FeedbackForm"
        onSubmit={handleSubmit}
      >
        <div className="question report-optin">
          <h3>{questions[0].name}</h3>
          <p>{questions[0].text}</p>
          <Field
            component={this.renderInput}
            type="text"
            name={questions[0].path}
          />
        </div>
        <div className="question user-data">
          <h3>Optional</h3>
          <p>
            Providing this information is completely voluntary. Your answers in this section will be kept confidential by HireHumanly and will not be shared with any potential employer. Not answering will not negatively affect your results in any way.
          </p>
          <RadioButtons
            question={questions[1]}
          />
          <RadioButtons
            question={questions[2]}
          />
        </div>
        <div className="question feedback-rating">
          <h3>{questions[3].name}</h3>
          <p>{questions[3].text}</p>
          <RadioButtons
            question={questions[3]}
          />
        </div>
      </form>
    );
  }
}
 
export default reduxForm({
  form: formName,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate,
})(FeedbackForm);
