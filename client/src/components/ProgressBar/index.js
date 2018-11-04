import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default class ProgressBar extends Component {
  state = {
    percent: this.props.progress,
  }

  componentWillReceiveProps(nextProps) {
    this.setPercent(nextProps.progress);
  }

  setPercent = progress => {
    this.setState({percent: progress})
  }

  render() {
    return (
      <progress max="100" value={this.state.percent}></progress>
    )
  }
}

ProgressBar.propTypes = {
  progress: PropTypes.number,
}
