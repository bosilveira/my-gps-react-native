import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./location.slice";
import networkReducer from "./network.slice";
import databaseReducer from "./database.slice";

export function makeStore() {
    return configureStore({
      reducer: {
        network: networkReducer,
        location: locationReducer,
        database: databaseReducer
    },
    });
}
  
export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;