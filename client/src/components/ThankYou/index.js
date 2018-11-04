import React from 'react';

import Header from '../Header';
import Card from '../Card';

import './index.scss';

const ThankYou = props => (
    <div className="thank-you-container">
      <div className="thank-you">
        <Header progress={100} />
        <Card size="default">
          <div className="thank-you-text">
            <p>Thank you and best of luck on your journey!</p>
          </div>
        </Card>
      </div>
    </div>
  );

export default ThankYou;
