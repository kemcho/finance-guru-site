const express = require("express");
const router = express.Router();
const async = require("async");

const YahooStocks = require("yahoo-stocks");

const passport = require("passport");
const Transaction = require("../../models/Transaction");
const ValidateTransactionInput = require("../../validation/transaction");

// @route   POST /api/transactions/
// @desc    add/edit a stock transaction
// @access  private with jwt auth
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidateTransactionInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newTransaction = new Transaction({
      user: req.user.id,
      ticker: req.body.ticker,
      units: req.body.units,
      price: req.body.price,
      date: req.body.date
    });

    newTransaction.save().then(post => res.json(post));
  }
);

// @route   GET /api/transactions/all
// @desc    get all transaction for a given user
// @access  private with jwt auth
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get current stock values from yahoo finance
    const currentTickerPrice = {};
    Transaction.collection.distinct("ticker").then(uniqueTickers => {
      async.forEachOf(
        uniqueTickers,
        (ticker, key, callback) => {
          YahooStocks.lookup(ticker).then(ticketInfo => {
            currentTickerPrice[ticker] = ticketInfo["currentPrice"];
            callback();
          });
        },
        err => {
          if (err)
            res
              .status(400)
              .json({ error: "Error in getting stock info from yahoo" });

          //Generate the current portfolio
          const currentPortfolio = [];
          Transaction.find()
            .then(transactions => {
              transactions.forEach(transaction => {
                const currentTransactionValue = {};
                currentTransactionValue["id"] = transaction.id;
                currentTransactionValue["stockTicker"] = transaction.ticker;
                currentTransactionValue["units"] = transaction.units;
                currentTransactionValue["currentPrice"] =
                  currentTickerPrice[transaction.ticker];
                currentPortfolio.push(currentTransactionValue);
              });
              res.json(currentPortfolio);
            })
            .catch(err =>
              res.status(404).json({ noPostsFound: "no transactions found" })
            );
        }
      );
    });
  }
);

// data structure returned by yahoo stocks
//{
//     "symbol": "MSFT",
//     "name": "Microsoft Corporation",
//     "exchange": "NASDAQ",
//     "currentPrice": 100.39,
//     "highPrice": 160,
//     "lowPrice": 75,
//     "meanPrice": 125.39,
//     "medianPrice": 126
// }

module.exports = router;
