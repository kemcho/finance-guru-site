import axios from "axios";
import { GET_ALL_TRANSACTIONS, GET_ERRORS } from "../actions/types";

//Get all transactions
export const getAllTransactions = () => dispatch => {
  axios
    .get("/api/transactions/all")
    .then(res => dispatch({ type: GET_ALL_TRANSACTIONS, payload: res.data }))
    .catch(err => dispatch({ type: GET_ERRORS, payload: {} }));
};

//Add new transactions
export const addTransaction = (expData, history) => dispatch => {
  axios
    .post("/api/transactions/", expData)
    .then(res => history.push("/current-portfolio"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
