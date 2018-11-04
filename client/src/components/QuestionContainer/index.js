import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { reduxForm } from 'redux-form';

import Card from '../Card';
import Label from '../Label';
import Question from '../Question';
import InstructionsChat from '../InstructionsChat';
import Video from '../Video';
import Buttons from '../Buttons';

import validate from '../../utils/validate';
import { getSubName } from '../../utils/validate';
import { videos } from '../../data/videos';
import './index.scss';

const formName = 'survey';

class QuestionContainer extends Component {
  state = {
    cardSize: 'narrow',
    inactive: false,
  }

  questionClassNames = classNames({
    'question-wrapper': true,
    'question-single': this.props.question !== 'combined',
    'question-multiple': this.props.question === 'combined',
  });

  setCardSize = nextProps => {
    const { question } = nextProps;

    question.instructions ? (
      this.setState({cardSize: 'narrow'})
    ) : question.type === 'checkbox' ? (
      this.setState({cardSize: 'tall'})
    ) : question.component === 'drag-and-drop' ? (
      this.setState({cardSize: 'large'})
    ) : (
      this.setState({cardSize: 'default'})
    )
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.question) {
      if (nextProps.question.id !== this.props.question.id) {
        this.setCardSize(nextProps);
      }
    }
  }

  renderVideo = () => {
    const { question } = this.props;

    return (
      <div className="question-video">
        <Video url={videos[`${question.video}`]} />
      </div>
    );
  }

  renderQuestion = (question, index) => {
    const { handleSubmit, onBlur, handleClick, anyTouched } = this.props;

    return (
      <Question
        question={question}
        key={index}
        index={index}
        handleClick={handleClick}
        handleSubmit={handleSubmit}
        onBlur={onBlur}
        anyTouched={anyTouched}
        formName={formName}
      />
    );
  }

  renderMultiQuestion = () => {
    const { question } = this.props;

    return (
      <div className="multi-question-wrapper">
        {question.subQuestions.map((subQuestion, index) => {
          let newName;
          let newSubQuestion = subQuestion;
          if (question.name.startsWith('EitherOr')) {
            const optionKeys = Object.keys(subQuestion.options);
            newName = `${optionKeys[0]}-${optionKeys[1]}`;
          } else {
            newName = subQuestion.name;
            if (subQuestion.type !== 'instructions') {
              newName = getSubName(question, subQuestion);
              newSubQuestion = Object.assign({}, subQuestion, { name: newName })
            }
          }
          return this.renderQuestion(newSubQuestion, index);
        })}
      </div>
    );
  }

  renderQuestions = () => {
    const { question } = this.props;

    if (question.component === 'instructions') {
      return <InstructionsChat element={question} />;
    } else if (question.component === 'combined') {
      return (
        <div className="multi-question-container">
          <Label question={question} number='multiple' />
          {question.video ? (
            <div className="multi-question-video-wrapper">
              {this.renderMultiQuestion()}
              {this.renderVideo()}
            </div>
          ) : (
            this.renderMultiQuestion()
          )}
        </div>
      );
    } else {
      return (
        <div className="single-question-container">
          {question.video ? (
            <div className="question-video-wrapper">
              {this.renderQuestion(question, 0)}
              {question.video && this.renderVideo()}
            </div>
          ) : (
            this.renderQuestion(question, 0)
          )}
        </div>
      );
    }
  }

  forwardClick = () => {
    const { validate, values, question, nextScreen } = this.props;

    let valueToValidate = {[question.path]: values[question.path]};

    if (question.component === 'drag-and-drop') {
      const found = Object.values(values).find(v => {
        return v === -1;
      });
      if (found === -1)
        return;
    }

    if (question.subQuestions) {
      valueToValidate = question.subQuestions.reduce((acc, subQuestion) => {
        if (subQuestion.required) {
          acc[subQuestion.path] = values[subQuestion.path];
        }
        return acc;
      }, {});
    }

    const errors = validate(valueToValidate);
    const errorMessages = Object.keys(errors).map(key => {
      if (!valueToValidate.hasOwnProperty(key)) {
        return;
      }
      return errors[key]
    }).filter(error => error);

    if (errorMessages.length) {
      return;
    }

    nextScreen();
  }

  render() {
    const { question, backButton, nextScreen, handleSubmit } = this.props;
    const { cardSize } = this.state;

    if (!question) {
      return null;
    }

    return (
      <Card key={question.id} size={cardSize}>
        <div className="question-container">
          <form 
            className={this.questionClassNames}
            name='QuestionForm' 
            onSubmit={handleSubmit}
          >
            {this.renderQuestions()}
          </form>
          <Buttons
            question={question}
            backClick={backButton}
            forwardClick={this.forwardClick}
            inactive={this.state.inactive}
          />
        </div>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    values: state.form.survey.values || {},
  }
}

QuestionContainer.propTypes = {
  question: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
  backButton: PropTypes.func,
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: false,
  validate,
})(connect(mapStateToProps)(QuestionContainer));
