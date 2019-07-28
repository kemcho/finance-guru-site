import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addTransaction } from "../../actions/portfolioActions";

class AddTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: "",
      units: "",
      price: "",
      date: "",
      errors: {},
      disabled: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const expData = {
      ticker: this.state.ticker,
      units: this.state.units,
      price: this.state.price,
      date: this.state.date
    };

    this.props.addTransaction(expData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="add-transaction">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/current-portfolio" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Transaction</h1>
              <p className="lead text-center">Add any Stock Transaction</p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Ticker"
                  name="ticker"
                  value={this.state.ticker}
                  onChange={this.onChange}
                  error={errors.ticker}
                />
                <TextFieldGroup
                  placeholder="* Price"
                  name="price"
                  value={this.state.price}
                  onChange={this.onChange}
                  error={errors.price}
                />
                <TextFieldGroup
                  placeholder="* Units"
                  name="units"
                  value={this.state.units}
                  onChange={this.onChange}
                  error={errors.units}
                />
                <h6>Transaction Date</h6>
                <TextFieldGroup
                  name="date"
                  type="date"
                  value={this.state.date}
                  onChange={this.onChange}
                  error={errors.date}
                />
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddTransaction.propTypes = {
  addTransaction: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addTransaction }
)(withRouter(AddTransaction));
