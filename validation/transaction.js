const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTransactionInput(data) {
  let errors = {};

  // validator only deals with strings!
  data.ticker = !isEmpty(data.ticker) ? data.ticker : "";
  data.units = !isEmpty(data.units) ? data.units : "";
  data.price = !isEmpty(data.price) ? data.price : "";

  if (!Validator.isNumeric(data.units)) {
    errors.units = "Need valid numeric units bought";
  } else if (data.units <= 0) {
    errors.units = "Need positive value for units bought";
  }

  if (!Validator.isNumeric(data.price)) {
    errors.price = "Need valid numeric for price";
  } else if (data.price <= 0) {
    errors.price = "Need positive value for price";
  }

  if (!Validator.isLength(data.ticker, { min: 1, max: 50 })) {
    errors.ticker = "Ticker text should be between 1 and 50 characters max";
  }

  if (Validator.isEmpty(data.ticker)) {
    errors.ticker = "Ticker is required";
  }
  if (Validator.isEmpty(data.units)) {
    errors.units = "Units is required";
  }
  if (Validator.isEmpty(data.price)) {
    errors.price = "Price is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
