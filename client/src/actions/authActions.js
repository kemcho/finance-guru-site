import axios from 'axios';
import {GET_ERRORS, SET_CURRENT_USER} from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

//Register user action
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
} 

//Login the user
export const loginUser = userData => dispatch => {
    axios.post('/api/user/login', userData)
    .then(res => {
        // save the token to local storage
        const {token} = res.data;
        localStorage.setItem('jwtToken', token);
        //set Token to the auth header
        setAuthToken(token);
        //Decode the token to get the user data
        const decoded = jwt_decode(token);
        // set the current user
        dispatch(setCurrentUser(decoded));

    }).catch(err => 
        dispatch({
            type:GET_ERRORS,
            payload: err.response.data
        }));
}

//Set current user 
export const setCurrentUser = decoded => {
    return{
        type: SET_CURRENT_USER,
        payload: decoded
    };
}