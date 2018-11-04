import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';

import { getSelected, countSelected } from '../../utils/validate';
import './index.scss';

class Checkboxes extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
  }

  state = {
    selectedCount: 0,
    maxSelect: this.props.question.validate_args[1]
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question.validate_args[1] !== this.props.question.validate_args[1]) {
      this.setState({ maxSelect: nextProps.question.validate_args[1]});
    }
    
    window.addEventListener('scroll', function() {
      const checkboxes = document.querySelector('.checkboxes');
      if (checkboxes) {
        let top = checkboxes.offsetTop;
        if (window.scrollY > top) {
          document.querySelector('.checkbox-messages').style.position = 'fixed';
        } else {
          document.querySelector('.checkbox-messages').style.position = 'initial';
        }
      }
    });
  }

  renderFieldError = ({input, meta: {touched, error, warning}}) => {
    const selected = countSelected(input.value);
    this.setState({selectedCount: selected});
    let checkboxesNotification = `${selected}/${this.state.maxSelect}`;
    let checkboxesError;
    if (touched && error && (selected > this.state.maxSelect)) {
      checkboxesError = error;
      window.scrollTo(0, 0);
      return (
        <div className="checkbox-messages">
          <span className="checkbox-notification">{checkboxesNotification}</span>
          <span className="checkbox-error" id="checkbox-error">{checkboxesError}</span>
        </div>
      );
    } else {
      return (
        <div className="checkbox-messages">
          <span className='checkbox-notification'>{checkboxesNotification}</span>
        </div>
      );
    }
  };

  render() {
    //console.log('props', this.props);
    const { question, handleClick, touched, formName, form } = this.props;
    let { options } = question;
    if (question.options_source) {
      const values = form[formName] ? form[formName].values : undefined;
      const source = values ? values[question.options_source] : {};
      options = getSelected(source);
    }

    const wrapHandleClick = (...args) => {
      if (question.autoContinue === 'false') {
        return;
      }
      handleClick(...args);
    }

    return (
      <div className="checkboxes">
        <div className="checkboxes-wrapper">
          <Field
            name={question.path}
            component={this.renderFieldError}
          />
          <div className="checkboxes-container">
            {options.map((option, index) => (
              <Field
                key={index}
                component={Checkbox}
                type="checkbox"
                name={`${question.path}[${option}]`}
                option={option}
                selectedCount={this.state.selectedCount}
                maxCount={this.state.maxSelect}
                onChange={wrapHandleClick}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    form: state.form,
  }
}

export default connect(mapStateToProps)(Checkboxes);
