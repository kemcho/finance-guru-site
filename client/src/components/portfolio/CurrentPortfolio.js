import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllTransactions } from "../../actions/portfolioActions";
import PropTypes from "prop-types";
import isEmpty from "../../validations/is-empty";
import { Link } from "react-router-dom";

class CurrentPortfolio extends Component {
  //call action to get all transactions for a users portfolio
  componentDidMount() {
    this.props.getAllTransactions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.portfolio) {
      this.setState({ transactions: nextProps.portfolio.transactions });
    }
  }

  render() {
    const { transactions } = this.props.portfolio;
    let content;

    if (isEmpty(transactions)) {
      content = "Loading your current portfolio ...";
    } else {
      const currentTransactions = this.props.portfolio.transactions.map(
        transaction => (
          <tr key={transaction.id}>
            <td>{transaction.stockTicker}</td>
            <td>{transaction.units}</td>
            <td>{transaction.price}</td>
            <td>{transaction.currentPrice}</td>
            <td>{transaction.profitLoss}</td>
          </tr>
        )
      );

      content = (
        <table className="table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Units</th>
              <th>Buy Price($)</th>
              <th>Current Price($)</th>
              <th>Profit Loss($)</th>
            </tr>
            {currentTransactions}
          </thead>
        </table>
      );
    }

    return (
      <div>
        <h1>
          Portfolio
          <Link to="/add-transactions" className="btn btn-light">
            Add Transaction
          </Link>
        </h1>
        {content}
      </div>
    );
  }
}

CurrentPortfolio.propTypes = {
  getAllTransactions: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  portfolio: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  portfolio: state.portfolio
});

export default connect(
  mapStateToProps,
  { getAllTransactions }
)(CurrentPortfolio);

//Todo: Add Test+ Add error handling when backend server fails to respond with data (unknown symbol for e.g.)
