import { combineReducers } from "redux";
import userReducer from "./userReducer";
import alertReducer from "./alertReducer";
import productReducer from "./productReducer";
import allUserReducer from "./allUserReducer";
import cartReducer from "./cartReducer";
import displayCartReducer from "./displayCartReducer";
import orderReudcer from "./orderReducer";
import categoryReducer from "./categoryReducer";

const myReducers = combineReducers({
  user: userReducer,
  alert: alertReducer,
  category: categoryReducer,
  products: productReducer,
  allUsers: allUserReducer,
  cart: cartReducer,
  isCart: displayCartReducer,
  orders: orderReudcer,
});

export default myReducers;
