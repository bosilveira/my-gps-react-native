import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./location.slice";
import networkReducer from "./network.slice";
import batteryReducer from "./battery.slice";

export function makeStore() {
    return configureStore({
      reducer: {
        network: networkReducer,
        location: locationReducer,
        battery: batteryReducer
    },
    });
}
  
export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;