import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { couponCodeReducer } from "./couponCode/couponCodeSlice";

const combinedReducer = combineReducers({
  couponCode: couponCodeReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logOutUser") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
