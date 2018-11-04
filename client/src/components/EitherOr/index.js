import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Field, change , unregisterField} from 'redux-form';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import validate from '../../utils/validate';

import './index.scss';

class EitherOr extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    onChange: PropTypes.func,
  }

  renderOption = (question, option, index, checked, onClick) => {
    const eitherOrClassNames = classNames({
      'either-or-text': true,
      'either-or-checked': checked,
      'either-or-unchecked': !checked,
    })
    return (
      <label className={eitherOrClassNames} onClick={onClick}>
        {option.description}
      </label>
    );
  };

  renderOr = index => {
    if (index === 0) {
      return (
        <span className="either-or-divider">OR</span>
      );
    }
  }

  renderInput = ({input, meta: {touched, error, warning}}) => {
    const { question } = this.props;

    let eitherOr_error = document.getElementById('radio-error');
    if (touched && error && eitherOr_error) {
      eitherOr_error.textContent = error;
    } else if (eitherOr_error) {
      eitherOr_error.textContent = '';
    }
    return (
      <div className="either-or-choices-wrapper">
        {question.options.map((option, index) => {
          const checked = input.value === option.category;
          const onClick = () => {
            input.onChange(option.category)
          }
          return (
            <div key={index}>
              <div className="either-or">
                {this.renderOption(question, option, index, checked, onClick)}
              </div>
              {this.renderOr(index)}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { question, onChange, touched, form, index } = this.props;
    const value = form.survey.values ? form.survey.values[question.path] : null;

    return (
      <div className="either-or-container">
        {index>0 && <hr/>}
        <div className="either-or-wrapper">
          <Field
            component={this.renderInput}
            type="radio"
            name={question.path}
            id={question.path}
            value={value}
          />
        </div>
        <span className="radio-error" id="radio-error"></span>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    form: state.form
  }
}

export default connect(mapStateToProps)(EitherOr);
