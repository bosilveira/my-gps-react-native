import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Battery from 'expo-battery';
import { BatteryState } from 'expo-battery/build/Battery.types';

export const checkBatteryPower = createAsyncThunk(
    "battery/checkPower",
    async ( args, { getState } ) => {
        const power = await Battery.getPowerStateAsync();
        return { batteryLevel: power.batteryLevel, batteryState: power.batteryState, batteryLowPowerMode: power.lowPowerMode};
      }
    );


const initialState = {
    batteryLevel: 0,
    batteryState: 0,
    batteryLowPowerMode: false
} as any;

 const batterySlice = createSlice({
    name: "battery",
    initialState,
    reducers: {

      setBatteryPower: (state, action) => {
        state.batteryLevel = action.payload.batteryLevel;
        state.batteryState = action.payload.batteryState;
        state.batteryLowPowerMode = action.payload.batteryLowPowerMode;
      },
    },
    extraReducers: (builder) => {

      builder.addCase(checkBatteryPower.fulfilled, (state, action) => {
        state.batteryLevel = action.payload.batteryLevel;
        state.batteryState = action.payload.batteryState;
        state.batteryLowPowerMode = action.payload.batteryLowPowerMode;
      });
    },
  });
  
  export const { setBatteryPower } =  batterySlice.actions;
  
  export default batterySlice.reducer;