import { GET_ALL_TRANSACTIONS } from "../actions/types";

const initialState = {
  portfolio: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_TRANSACTIONS:
      //console.log("I am returning this data from reducer --> "+action.payload);
      return {
        ...state,
        transactions: action.payload
      };
    default:
      //console.log("I am returning no data from reducer {} ");
      return state;
  }
}
