import axios from 'axios';

const setAuthToken = token => {
    if(token){
        //set the Authorization token header
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        //delete the token
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;