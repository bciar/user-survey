import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default class Card extends Component {
  state = {
    animate: false,
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      if (this.unmounted) {
        return;
      }
      this.setState({ animate: true })
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    return(
      <div className={`card ${this.state.animate ? 'card-animated-forward' : ''} card-${this.props.size}`}>
        {this.props.children}
      </div>
    );
  }
}

Card.propTypes = {
  size: PropTypes.string.isRequired,
}
