import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from '../Header';
import Likert from '../Likert';
import QuestionContainer from '../QuestionContainer';

import { calculateResult } from '../../actions/calculateActions';
import { sendAnswers } from '../../actions/answerActions';
import getMappedQuestions from '../../utils/getMappedQuestions';
import data from '../../data/questions.json';
import store from '../../store'

import './index.scss';

const { questions } = data;
getMappedQuestions(questions);

class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevScreens: [],
      screen: 1,
      progress: (1/questions.length) * 100,
      direction: undefined,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const { direction } = this.state;
    this.setProgressPercent();
    if (direction === 'forward') {
      this.nextScreen();
    } else if (direction === 'backward') {
      this.lastScreen(nextProps);
    }

    if (nextProps.result.calculatedResult !== this.props.result.calculatedResult) {
      this.sendResult(nextProps.result.calculatedResult);
    }
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  setDirectionFlag = direction => {
    this.setState({ direction }, () => {
      this.componentWillReceiveProps(this.props);
    });
  };

  setProgressPercent = () => {
    const { screen } = this.state;
    let progressPercent = (screen/questions.length) * 100;
    this.setState({ progress: progressPercent });
  };

  triggerCalculateResult = newState => {
    const { result, calculateResult, form } = this.props;
    const { calculatingResult } = this.state;
    const { values } = form.survey;

    if (result.calculatedResult === undefined && !calculatingResult) {
      calculateResult(values);
      this.setState({...newState, direction: 'forward', calculatingResult: true}, this.scrollToTop);
    }
  }

  sendResult = result => {
    const { sendAnswers, form, candidate } = this.props;
    const { values } = form.survey;
    const answersObject = {
      answers: values,
      result,
      candidateId: candidate._id,
      completedSurvey: true,
    };

    sendAnswers(answersObject);
  }

  nextScreen = () => {
    const { prevScreens, screen } = this.state;
    const direction = undefined;

    prevScreens.push(screen);
    const newState = { direction, prevScreens };
  
    if (screen === 18) {
      this.triggerCalculateResult(newState);
    } else {
      this.setState({ ...newState, screen: screen + 1 }, this.scrollToTop);
    }
  };

  lastScreen = nextProps => {
    const { prevScreens } = this.state;
    const direction = undefined;
    let screen = prevScreens.pop();
    if (screen === undefined) {
      screen = 1;
      window.history.go(-1);
    }
    this.setState({ direction, screen, prevScreens }, this.scrollToTop);
  };

  render() {
    const currentQuestion = Object.assign(
      {},
      questions[this.state.screen - 1]
    );

    return (
      <div className="survey">
        <Header progress={this.state.progress} />
        {currentQuestion.type === 'likert' ? (
          <Likert
            question={currentQuestion}
            backButton={() => this.setDirectionFlag('backward')}
            handleClick={() => this.setDirectionFlag('forward')}
            ref={container => {
              this.questionContainer = container;
            }}
          />
          ) : (
          <QuestionContainer
            question={currentQuestion}
            backButton={() => this.setDirectionFlag('backward')}
            handleClick={() => this.setDirectionFlag('forward')}
            nextScreen={() => this.nextScreen()}
            ref={container => {
              this.questionContainer = container;
            }}
          />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    form: state.form,
    candidate: state.candidate,
    result: state.result
  };
};

const mapDispatchToProps = dispatch => {
  return {
    calculateResult: answers => dispatch(calculateResult(answers)),
    sendAnswers: answers => dispatch(sendAnswers(answers))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
