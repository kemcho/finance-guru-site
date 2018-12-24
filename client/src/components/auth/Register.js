import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
//withRouter provides access to history object for navigation
import {withRouter} from 'react-router-dom';
//connect is used to connect presentation component like current file
//register component with react store. 
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authActions';

class Register extends Component {
  constructor(){
    super();
    this.state = {
      name:'',
      email:'',
      password:'',
      password2:'',
      errors:{}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
  }

  //when ever props are changed, this lifecycle method gets called.
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors){
      this.setState({errors:nextProps.errors});
    }
  }
  

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  onSubmit(e){
    e.preventDefault();
    const newUser={
      name: this.state.name,
      email:this.state.email,
      password:this.state.password,
      password2:this.state.password2
    }

    this.props.registerUser(newUser, this.props.history);
  
  }
  
  render() {
    const {errors} = this.state;
    
    return (
    <div className="register">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Sign Up</h1>
          <p className="lead text-center">Create your DevConnector account</p>
          <form onSubmit={this.onSubmit}>
          <TextFieldGroup
            name="name"
            placeholder="User name"
            value={this.state.name}
            error={errors.name}
            type="text"
            onChange={this.onChange}
            ></TextFieldGroup>

          <TextFieldGroup
            name="email"
            placeholder="Email Address"
            value={this.state.email}
            error={errors.email}
            info="This site uses gravatar, if you want a profile image, use a Gravatar email"
            type="email"
            onChange={this.onChange}
            ></TextFieldGroup>

            <TextFieldGroup
            name="password"
            placeholder="Users password"
            value={this.state.password}
            error={errors.password}
            type="password"
            onChange={this.onChange}
            ></TextFieldGroup>

            <TextFieldGroup
            name="password2"
            placeholder="Users password 2nd time entry"
            value={this.state.password2}
            error={errors.password2}
            type="password"
            onChange={this.onChange}
            ></TextFieldGroup>
            
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>

    )
  }
}


//React provides an internal mechanism for adding type-checking to components. 
//React components use a special property named propTypes to setup type-checking.
Register.propTypes ={
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

//mapStateToProps subscribes this component to redux store updates
//thus mapStateToProps will be called everytime the store is updated 
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

//Here we are basically connecting the registerUser action with current Register component.
export default connect (mapStateToProps, {registerUser} )(withRouter(Register));
