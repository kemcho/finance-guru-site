//Todo: fix the initial {} display on CurrentProfolio, by showing a spinner
//Todo: add error handling when backend server fails to respond with data (unknown symbol for e.g.)

import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getAllTransactions} from '../../actions/portfolioActions';
import PropTypes from 'prop-types';

class CurrentPortfolio extends Component {
  //call action to get all transactions for a users portfolio
  componentDidMount(){
    this.props.getAllTransactions();
  }

  componentWillReceiveProps(nextProps) {
    //console.log("logging next props  "+JSON.stringify(nextProps));
    
    if (nextProps.portfolio) {
        this.setState({ portfolio: nextProps.portfolio });
    }
  }
 
  render() {  

    const {portfolio} = this.props.portfolio;
    let content;

    if(portfolio == null){
        content = "Spinner";
    }else{
        content = JSON.stringify(portfolio);
    }

    return (
      <div>
        <h1>Todo: Render all transactions here</h1>
        {content}
      </div>
    )
  }
}


CurrentPortfolio.propTypes = {
    getAllTransactions: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    portfolio: PropTypes.object.isRequired
  }
  
  const mapStateToProps = state => ({
    auth: state.auth,
    portfolio: state.portfolio
  });

export default connect(mapStateToProps, {getAllTransactions})(CurrentPortfolio);


