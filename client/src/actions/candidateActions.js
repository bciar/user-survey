import axios from 'axios';

export const fetchCandidateSuccess = candidate => {
  return {
    type: 'FETCH_CANDIDATE_SUCCESS',
    candidate,
  }
}

export const fetchOrganizationSuccess = organization => {
  return {
    type: 'FETCH_ORGANIZATION_SUCCESS',
    organization,
  }
}

export const fetchCandidate = id => {
  return dispatch => {
    return axios.get(`/api/candidates/${id}`)
      .then(response => {
        dispatch(fetchCandidateSuccess(response.data));
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const fetchOrganization = id => {
  return dispatch => {
    return axios.get(`/api/organizations/${id}`)
      .then(response => {
        dispatch(fetchOrganizationSuccess(response.data));
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const setLiveCandidate = () => {
  return {
    type: "SET_LIVE_CANDIDATE"
  };
};

export const sendLiveCandidateData = candidateInfo => {
  return dispatch => {
    return axios.put(`/api/candidates/${candidateInfo.candidateId}`, { ...candidateInfo })
      .then(response => {
        console.log(candidateInfo)
      })
      .catch(err => {
        console.err(err);
      });
  };
};
