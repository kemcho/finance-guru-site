import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
//import Dashboard from './components/dashboard/Dashboard';
import jwt_decode from 'jwt-decode';
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';
import CurrentPortfolio from './components/portfolio/CurrentPortfolio';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';

import './App.css';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import EditProfile from './components/edit-profile/EditProfile';

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
    store.dispatch(clearCurrentProfile());
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
              {/* <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard}/>
              </Switch> */}
              <Switch>
                <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/current-portfolio" component={CurrentPortfolio}/>
              </Switch>
              <Switch>
                <PrivateRoute exact path="/add-experience" component={AddExperience} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/add-education" component={AddEducation} />
              </Switch>
            </div>          
            <Footer/>        
          </div>
        </Router>

      </Provider>
    );
  }
}

export default App;


