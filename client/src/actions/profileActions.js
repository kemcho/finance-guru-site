import axios from 'axios';
import {GET_PROFILE, 
        PROFILE_LOADING, 
        CLEAR_CURRENT_PROFILE, 
        GET_ERRORS,
        SET_CURRENT_USER} from '../actions/types';

//Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profiles')
        .then(res => dispatch({type: GET_PROFILE, payload: res.data}))
        .catch(err => dispatch({type: GET_PROFILE, payload:{}}));
}

//Set Profile loading state
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
}

//Clear profile loading state
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
}

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
    axios
      .post('/api/profiles', profileData)
      .then(res => history.push('/dashboard'))
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };

  // Add experience
export const addExperience = (expData, history) => dispatch => {
  axios
    .post('/api/profiles/experience', expData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

  //Delete Account
  export const deleteAccount = () => dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      axios
        .delete('/api/profiles')
        .then(res =>
          dispatch({
            type: SET_CURRENT_USER,
            payload: {}
          })
        )
        .catch(err =>
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          })
        );
    }
  };