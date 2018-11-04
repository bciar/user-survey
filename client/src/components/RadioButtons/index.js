import React, {Component} from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import validate from '../../utils/validate';

import './index.scss';

export default class RadioButtons extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    onChange: PropTypes.func,
  }

  renderOption = (question, option, index, id, checked) => {
    const radioButtonClassNames = classNames({
      'radio-button-text': true,
      'radio-button-checked': checked,
      'radio-button-unchecked': !checked,
    })
    if (typeof option === 'object') {
      return (
        <label 
          className={radioButtonClassNames} 
          htmlFor={id}
        >
          {Object.values(option)[0]}
        </label>
      );
    } else {
      return (
        <label
         className={radioButtonClassNames} 
         htmlFor={id}
        >
          {option}
        </label>
      );
    }
  };

  renderInput = ({input, placeholder, type, meta: {touched, error, warning}, id, index, question, option}) => {
    let radio_error = document.getElementById('radio-error');
    if (touched && error && radio_error) {
      radio_error.textContent = error;
    } else if (radio_error){
      radio_error.textContent = '';
    }
    return (
      <div>
        <input
         {...input} 
         className='radio-button' 
         placeholder={placeholder} 
         type={type} 
         id={id}
        />
        {this.renderOption(question, option, index, id, input.checked)}
      </div>
    );
  };

  render() {
    const { question, handleClick, onChange, touched } = this.props;
    const wrapHandleClick = (...args) => {
      if (question.name === "Feedback") {
        const c = args[0].currentTarget;
        document.querySelectorAll('.feedback-rating .radio-button label').forEach(e => {
          e.style.color = 'black';
          e.style.background = 'white';
        });
        const e = document.querySelector('.feedback-rating .radio-button label[for="'+c.id+'"]');
        e.style.color = 'white';
        e.style.background = '#75CC43';
      }
      if (handleClick) {
        if (question.autoContinue === 'false') {
          return;
        }
        handleClick(...args);
      } else if (onChange) {
        onChange(args[1]);
      }
    }

    return (
      <div className="radio-buttons">
        {question.label && <h4>{question.label}</h4>}
        <div className="radio-buttons-wrapper">
          {question.options.map((option, index) => {
            const id = `${question.path}-option-${option}`;
            return (
              <div className="radio-button-wrapper" key={index}>
                <div className="radio-button">
                  <Field
                    component={this.renderInput}
                    type="radio"
                    name={question.path}
                    value={option}
                    id={id}
                    question={question}
                    option={option}
                    onChange={wrapHandleClick}
                    index={index}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <span
         className="radio-error" 
         id="radio-error"
        >
        </span>
      </div>
    )
  }
}
