import axios from 'axios';
import { push } from 'connected-react-router';

export const sendAnswersSuccess = answers => {
  return {
    type: 'SEND_ANSWERS_SUCCESS',
    answers,
  }
}

export const sendAnswers = answersObject => {
  return dispatch => {
    return axios.put(`/api/candidates/${answersObject.candidateId}`, { ...answersObject })
      .then(response => {
        dispatch(sendAnswersSuccess(response.data.answers))
        dispatch(push('/congratulations'));
      })
      .catch(error => {
        dispatch(push('/congratulations'));
        throw(error);
      });
  };
};
