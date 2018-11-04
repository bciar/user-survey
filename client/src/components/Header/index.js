import React from 'react';
import PropTypes from 'prop-types';

import ProgressBar from '../ProgressBar';
import logo from '../../../public/assets/logo.png';
import './index.scss';

const Header = props => {
  return (
    <div className="header">
      <ProgressBar progress={props.progress} />
    </div>
  )
}
// <img src={logo} className="logo" />

Header.propTypes = {
  progress: PropTypes.number.isRequired,
}
 
export default Header;
