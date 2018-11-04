import React from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Looks like this page doesn't exist.</h1>
      <Link to="/">
        <h2>Survey Start Page</h2>
      </Link>
    </div>
  );
}

export default NotFound; 
