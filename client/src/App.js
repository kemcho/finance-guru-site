import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import jwt_decode from 'jwt-decode';

import './App.css';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

//check for login token and ensure user stays logged in
if(localStorage.jwtToken){
  //Set the auth token header for this current page
  setAuthToken(localStorage.jwtToken);
  //Set the current user as well from the token in store
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  
  //check if expired token
  const currentTimeInSeconds = Date.now()/1000;
  if(decoded.exp < currentTimeInSeconds){
    store.dispatch(logoutUser());
    window.location.href = './login';
  }


}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing}/>
            <div className="container">
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
            </div>          
            <Footer/>        
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;


