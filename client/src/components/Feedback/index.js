import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Card from '../Card';
import FeedbackForm from './FeedbackForm';
import Button from '../Buttons/Button';

import { sendFeedback } from '../../actions/feedbackActions';

const formName = 'feedback';

const Feedback = props => {
  const { form, candidate, sendFeedback } = props;
  const feedbackObject = {};
  if (form.feedback && form.feedback.values) {
    feedbackObject.feedback = form.feedback.values;
    feedbackObject.candidateId = candidate._id;
  }

  return (
    <div className="feedback">
      <Card size="huge">
        <FeedbackForm />
        <Link to="/thank-you">
          <Button 
            text="Done"
            className="next"
            handleClick={() => sendFeedback(feedbackObject)}
          />
        </Link>
      </Card>
    </div>
  );
}
 
const mapStateToProps = state => {
  return {
    form: state.form,
    candidate: state.candidate,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendFeedback: feedback => dispatch(sendFeedback(feedback)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);

