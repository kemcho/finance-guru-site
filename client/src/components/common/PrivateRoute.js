import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

//Read more on details of private route code 
//here - https://tylermcginnis.com/react-router-protected-routes-authentication/
const PrivateRoute = ({component: Component, auth, ...rest}) => (
    <Route
        {...rest}
        render = { props => 
                auth.isAuthenticated === true? 
                    (<Component {...props}></Component>)
                    :(<Redirect to ="/login"></Redirect>)
        }
    />
);


PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);