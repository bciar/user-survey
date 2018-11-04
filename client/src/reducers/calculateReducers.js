import getResults from '../utils/calculate.js';

const result = (state = {}, action) => {
  switch(action.type) {
    case 'CALCULATE_RESULT':
      const calculatedResult = getResults(action.answers);
      return { ...state, calculatedResult }
      break;
    default:
      return state;
  }
  return state;
};

export default result;
