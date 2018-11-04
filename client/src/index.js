import React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import './index.scss';
import store, { history } from './store';

import Welcome from './components/Welcome';
import Survey from './components/Survey';
import Congratulations from './components/Congratulations';
import Feedback from './components/Feedback';
import ThankYou from './components/ThankYou';
import NotFound from './components/NotFound';

const Root = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/survey" component={Survey} />
          <Route path="/congratulations" component={Congratulations} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="*" component={NotFound} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  )
}

render(<Root/>, document.querySelector("#root"));
