const feedback = (state = {}, action) => {
  switch(action.type) {
    case 'SEND_FEEDBACK_SUCCESS':
      return action.feedback;
      break;
    default:
      return state;
  }
  return state;
}

export default feedback;
