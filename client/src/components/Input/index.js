import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import validate from '../../utils/validate';
import './index.scss';

class Input extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onBlur: PropTypes.func,
  }

  componentWillMount() {
    const { question } = this.props;
    if (question.validate_args) {
      this.setState({ charLimit: question.validate_args[0]});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question.validate_args) {
      if (this.state.charLimit === undefined || nextProps.question.validate_args[0] !== this.props.question.validate_args[0]) {
        this.setState({ charLimit: nextProps.question.validate_args[0]});
      }
    }
  }

  characterCount = value => {
    const { charLimit } = this.state;
    let counter = `${value.length}/${charLimit}`;
    if (charLimit !== undefined) {
      return (
        <span className="character-count">{counter}</span>
      );
    }
  }

  renderField = ({input, type, meta: {touched, error, warning}}) => {
    return (
      <div className="input-wrapper">
        <input {...input} type={type} />
        {touched &&
            ((error && <span className="error-message">{error}</span>) ||
              (warning && <span>{warning}</span>)
            )
        }
      </div>
    );
  }

  render() {
    const { question, onBlur } = this.props;
    return (
      <Field
        component={this.renderField}
        type="text"
        name={question.path}
        onBlur={onBlur}
        onFocus={this.setCharLimit}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    form: state.form,
  }
}

export default connect(mapStateToProps)(Input);
