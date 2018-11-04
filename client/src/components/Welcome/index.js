import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

import { fetchCandidate, fetchOrganization, setLiveCandidate, sendLiveCandidateData } from '../../actions/candidateActions';

import Header from '../Header';
import Card from '../Card';
import Video from '../Video';
import Button from '../Buttons/Button';

import data from '../../data/questions.json';
import video from '../../../public/assets/office.mp4';
import './index.scss';

class Welcome extends Component {
  state = {
    liveCandidate: false,
  }

  componentDidMount() {
    const params = this.props.location.search;
    if (params.includes('?')) {
      const parsedParams = queryString.parse(params);
      this.props.fetchCandidate(parsedParams.candidateId);
      this.props.fetchOrganization(parsedParams.orgId);
      this.setState({ liveCandidate: true }), this.props.setLiveCandidate();
    }
  }

  componentDidUpdate() {
    if (this.props.candidate && this.props.candidate._id && this.state.liveCandidate) {
      const data = {
        candidateId: this.props.candidate._id,
        clickedSurveyLink: this.props.candidate.clickedSurveyLink,
      }
      this.props.sendLiveCandidateData(data);
    }
  }

  handleBegin = e => {
    e.preventDefault();
    let person = prompt('Please enter your name:');
    if (person != null) {
      return axios
        .post(`/api/usertesting/adduser`, { userName: person })
        .then(response => {
          let candidateId = response.data._id;
          this.props.fetchCandidate(candidateId);
          this.props.fetchOrganization(response.data.orgId);
          this.setState({ liveCandidate: false }), this.props.setLiveCandidate();
          setTimeout(() => {
            this.props.history.push('/survey');
          }, 2000);
        })
        .catch(error => {
          throw error;
        });
    } else {
      return false;
    }
  };

  render() {
    const { candidate, organization } = this.props;
    let name = '',
      organizationName = `the company you're applying to`;
    if (candidate !== {} && candidate.name) {
      name = ` ${candidate.name}`;
    }
    if (organization !== {} && organization.organizationName) {
      organizationName = organization.organizationName;
    }

    const progress = (0.75/data.questions.length) * 100;

    const renderStartButton = () => {
      const params = this.props.location.search;
      if (!params.includes("?")) {
        return (
          <div onClick={this.handleBegin} className="start-survey-button">
            <Button className="next" text="Let's Begin!" />
          </div>
        );
      } else {
        return (
          <Link to="/survey" className="start-survey-button">
            <Button className="next" text="Let's Begin!" />
          </Link>
        );
      }
    };

    return (
      <div className="welcome">
        <div className="welcome-main-section">
          <Header progress={progress} />
          <Card size="default">
            <div className="welcome-content-wrapper">
              <div className="welcome-text">
                <p> Hello{name}!</p> 
                <p>
                  Thank you for investing your time in our alliance exercise. We believe by aligning your values and beliefs with our mission and culture, we can ignite meaningful work, together!
                </p>
                <p>
                  Over the next 20 minutes you'll be presented with a variety of questions and scenarios to illuminate your best self. By participating, you will gain deeper personal insights to help further your career while giving us a more complete view into who you are beyond just your skills.
                </p>
                <p>
                  Advice: Just be you! The more authentic you are, the better your opportunity to thrive. This exercise has no bias and there are no wrong answers. The company will not even see your individual answers…only a summary.
                </p>
                <p>
                  Once finished, we’ll share your results in a personalized report.
                </p>
                <p className="welcome-text-note">
                  PS – We're all human. We are fully committed to your privacy. By participating, you agree to share your information as part of the application process. If you have questions or concerns, please check out our <a href="https://hirehumanly.com/terms-of-service">terms of service</a>.
                </p>
              </div>
            </div>
            <div className="start-button">
              {renderStartButton()}
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    candidate: state.candidate,
    organization: state.organization,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCandidate: _id => dispatch(fetchCandidate(_id)),
    fetchOrganization: orgId => dispatch(fetchOrganization(orgId)),
    setLiveCandidate: () => dispatch(setLiveCandidate()),
    sendLiveCandidateData: data => dispatch(sendLiveCandidateData(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
