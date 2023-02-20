import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./api.slice";
import locationReducer from "./location.slice";
//import loginReducer from "./loginSlices.redux";
//import userReducer from  "./userSlices.redux";

export function makeStore() {
    return configureStore({
      reducer: {
        api: apiReducer,
        location: locationReducer,
    },
    });
  }
  
  export const store = makeStore();
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;