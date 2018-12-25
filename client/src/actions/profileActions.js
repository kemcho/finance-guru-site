import axios from 'axios';
import {GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE} from '../actions/types';

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