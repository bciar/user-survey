import React, {Component} from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import validate from '../../utils/validate';

import './index.scss';

export default class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charLimit: props.question.validate_args[0],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question.validate_args[0] !== this.props.question.validate_args[0]) {
      this.setState({ charLimit: nextProps.question.validate_args[0]});
    }
  }

  renderTextarea = ({input, meta: {touched, error, warning}}) => {
    return (
      <div className="textarea-wrapper">
        <textarea
          onBlur={input.onBlur}
          onChange={input.onChange}
          value={input.value}
        />
        {touched &&
            ((error && <span className="error-message">{error}</span>) ||
              (warning && <span>{warning}</span>)
            )
        }
        {this.characterCount(input.value)}
      </div>
    );
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

  render() {
    const { question, onChange, touched } = this.props;
    return (
      <Field
        component={this.renderTextarea}
        name={`${question.path}`}
        question={question}
      />
    );
  }
}

Textarea.propTypes = {
  question: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
}
