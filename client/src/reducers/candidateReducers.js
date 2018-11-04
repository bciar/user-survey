const candidate = (state = { clickedSurveyLink: false }, action) => {
  switch (action.type) {
    case 'FETCH_CANDIDATE_SUCCESS':
      return { ...state, ...action.candidate };
      break;
    case 'SET_LIVE_CANDIDATE':
      return { ...state, clickedSurveyLink: true };
      break;
    default:
      return state;
  }
  return state;
};

const organization = (state = '', action) => {
  switch (action.type) {
    case 'FETCH_ORGANIZATION_SUCCESS':
      return action.organization;
      break;
    default:
      return state;
  }
  return state;
};

export { candidate, organization };
