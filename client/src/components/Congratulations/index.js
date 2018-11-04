import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from '../Header';
import Card from '../Card';
import Button from '../Buttons/Button';

import './index.scss';

const Congratulations = props => {
  const { candidate, organization } = props;

  let organizationName = 'your target company';
  let candidateName = '';
  if (organization) {
    organizationName = organization.name;
  }
  if (candidate.name) {
    candidateName = `, ${candidate.name}`;
  }

  return (
    <div className="congratulations-container">
      <div className="congratulations">
        <Header progress={100} />
        <Card size="default">
          <div className="congratulations-text">
            <p>Congratulations{candidateName}! You did a great job! We’re thankful you invested your time to help us get to know you better. Your responses will help articulate to {organizationName} your values, beliefs and behaviors. They’ll be in touch soon if you this opportunity is the right alignment for you!</p>
            <p>We want you to know we value your time. Therefore, we’re happy to provide you with a personalized report that includes the same results that {organizationName} receives. If you’d like to receive it via email, move on to the next screen. If you’re not interested in the report, you can simply click “Done”.</p>
          </div>
          <div className="congratulations-button-wrapper">
          <Link to="/thank-you">
              <Button
                className="back"
                text="Done"
              />
            </Link>
            <Link to="/feedback">
              <Button
                className="next"
                text="Next"
              />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    candidate: state.candidate,
    organization: state.organization,
  }
};

export default connect(mapStateToProps)(Congratulations);
