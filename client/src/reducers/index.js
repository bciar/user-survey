import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import result from './calculateReducers';
import answers from './answerReducers';
import feedback from './feedbackReducers';
import { candidate, organization } from './candidateReducers';

const reducers = {
  form: formReducer,
  candidate,
  organization,
  result,
  answers,
  feedback,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;
