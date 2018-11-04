import axios from 'axios';
import { push } from 'connected-react-router';

export const sendFeedbackSuccess = feedback => {
  return {
    type: 'SEND_FEEDBACK_SUCCESS',
    feedback,
  }
}

export const sendFeedback = feedbackObject => {
  return dispatch => {
    return axios.put(`/api/candidates/${feedbackObject.candidateId}`, { ...feedbackObject })
      .then(response => {
        console.log('response', response)
        console.log('feedback', feedbackObject);
        dispatch(sendFeedbackSuccess(response.data.feedback))
      })
      .catch(error => {
        console.error(error);
        throw(error);
      });
  };
};
