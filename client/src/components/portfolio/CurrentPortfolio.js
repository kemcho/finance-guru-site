import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllTransactions } from "../../actions/portfolioActions";
import PropTypes from "prop-types";
import isEmpty from "../../validations/is-empty";
import { Table } from "antd";

class CurrentPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      errors: {},
      portfolio: []
    };
  }

  //call action to get all transactions for a users portfolio
  componentDidMount() {
    this.props.getAllTransactions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.portfolio) {
      this.setState({ portfolio: nextProps.portfolio });
    }
  }

  render() {
    const columns = [
      {
        title: "Ticker Name",
        dataIndex: "Stock Ticker",
        key: "Stock Ticker"
      },
      {
        title: "Units",
        dataIndex: "Units",
        key: "Units"
      },
      {
        title: "Current Price",
        dataIndex: "Current Price",
        key: "Current Price"
      }
    ];

    return (
      <div>
        <h1>Portfolio</h1>
        <Table
          size="small"
          rowKey="Stock Ticker"
          bordered={true}
          pagination={false}
          columns={columns}
          dataSource={this.state.portfolio.portfolio}
        />
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
