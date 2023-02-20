import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./api.slice";
import locationReducer from "./location.slice";
import networkReducer from "./network.slice";
//import loginReducer from "./loginSlices.redux";
//import userReducer from  "./userSlices.redux";

export function makeStore() {
    return configureStore({
      reducer: {
        network: networkReducer,
        location: locationReducer,
    },
    });
  }
  
  export const store = makeStore();
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;