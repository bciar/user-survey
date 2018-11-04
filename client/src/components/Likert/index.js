import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';

import Card from '../Card';
import Label from '../Label';
import RadioButtons from '../RadioButtons';
import Buttons from '../Buttons';

import validate from '../../utils/validate';
import './index.scss';

const formName = 'survey';

class Likert extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    handleSubmit: PropTypes.func,
    onBlur: PropTypes.func,
    backButton: PropTypes.func.isRequired,
  }

  state = {
    currentQuestion: 0,
    inactiveButton: true,
    offset: 0,
  }

  questionNodes = {}
  labelNodes = {}
  radioNodes = {}

  componentWillReceiveProps(nextProps) {
    const { question } = this.props;
    if (this.props.question.id !== nextProps.question.id) {
      this.setState({ currentQuestion: 0, offset: 0 });
    }
    this.state.currentQuestion + 1 === question.subQuestions.length && this.setActiveButton();
  }

  doSubmit() {
    let submit = this.props.handleSubmit(this.submitted.bind(this));
    submit();
  }

  submitted() {
    this.props.handleClick();
  }

  incrementCurrentQuestion = () => {
    this.setState(prevState => ({
      currentQuestion: prevState.currentQuestion + 1,
    }), () => {
      if (!this.questionNodes[this.state.currentQuestion]) {
        return;
      }
      if (screen.width < 768) {
        /* this.setState({ 
          offset: this.getQuestionOffsetTop(this.state.currentQuestion) - 10
        }); */
        const scrollTop = this.getQuestionOffsetTop(this.state.currentQuestion) - 10;
        // window.scroll({ top: scrollTop, behavior: "smooth" });
        
        let i = window.scrollY;
        const interval = setInterval(function() {
          window.scrollTo(0, i);
          i += 10;
          if (i >= scrollTop) clearInterval(interval);
        }, 20);
      }
    });
  }

  setActiveButton = () => {
    this.setState({inactiveButton: false});
  }

  getQuestionOffsetTop = index => this.questionNodes[index].offsetTop;

  renderLikertScale = question => {
    const { handleSubmit, onBlur, handleClick, anyTouched } = this.props;
    const { currentQuestion, offset } = this.state;

    return (
      <div 
        className='multi-question-wrapper likert-wrapper'
        style={{
          transform: `translate3d(0px, -${offset}px, 0px)`, 
          flexWrap: 'nowrap'
        }}
      >
        {question.subQuestions.map((subQuestion, index) => {
          const likertClassNames = classNames({
            'question': true,
            [`question-${question.name}`]: true,
            'likert-question': true,
            'likert-question-active': subQuestion.id === (currentQuestion + 1),
            'likert-question-inactive': subQuestion.id > (currentQuestion + 1),
            'likert-question-passed': subQuestion.id < (currentQuestion + 1),
          });

          const labelsClassNames = classNames({
            'likert-question-label-active': subQuestion.id === (currentQuestion + 1),
            'likert-question-label-inactive': subQuestion.id > (currentQuestion + 1),
            'likert-question-label-passed': subQuestion.id < (currentQuestion + 1),
          })

          return (
            <div 
              className={likertClassNames} 
              key={subQuestion.id} 
              ref={node => {
                this.questionNodes[index] = node;
              }}
            >
              <form 
                className={'question-wrapper question-multiple'} 
                name='QuestionForm' 
                onSubmit={handleSubmit}
              >
                <Label 
                  question={subQuestion} 
                  number='single' 
                 />
                <RadioButtons
                  question={subQuestion}
                  handleClick={this.incrementCurrentQuestion}
                  touched={anyTouched}
                />
              </form>
            </div>
          );
        })}
      </div>
    );
  }

  render() { 
    const { question } = this.props;
    if (!question) {
      return null;
    }
    return (
      <Card key={question.id} size="default">
        <div className="question-container likert-container">
          <div className="multi-question-container">
            {this.renderLikertScale(question)}
            <Buttons
              question={question}
              backClick={() => this.props.backButton()}
              forwardClick={() => this.doSubmit()}
              inactive={this.state.inactiveButton}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(Likert);
