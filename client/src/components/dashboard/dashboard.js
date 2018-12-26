import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentProfile} from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import {Link} from 'react-router-dom';

class Dashboard extends Component {
  //call action to get the current user profile
  componentDidMount(){
      this.props.getCurrentProfile();
  }

  render() {

    const {user} = this.props.auth;
    const {profile,loading} = this.props.profile;
    let dashboardContent;

    if(profile == null|| loading){
      dashboardContent = <Spinner/>
    }else{
      //user may not have creatd a profile
      if(Object.keys(profile).length >0){
        //Todo - display profile here
        dashboardContent = JSON.stringify(profile);  
      }else {
        //the user does have a profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not setup your profile yet, please add some info...</p>
            <Link to="/create-profile" 
                className="btn btn-lg btn-info">Create Profile
            </Link> 
          </div>

        );
      }
    }

    return (
      <div>
        <div className="dashboard">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4">Dashboard</h1>
                {dashboardContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, {getCurrentProfile})(Dashboard);
